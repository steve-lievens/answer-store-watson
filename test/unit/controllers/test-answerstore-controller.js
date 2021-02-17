const chai = require("chai");
const mockRequire = require("mock-require");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");

const expect = chai.expect;
const sandbox = sinon.createSandbox();
chai.use(sinonChai);
chai.use(chaiAsPromised);

// example golden path export unit tests of answers controller
describe("Test golden paths of answers controller", () => {
  class cloudantMock {
    constructor() {
      this.db = {
        create: () =>
          Promise.reject({
            error: "file_exists",
          }),
        use: () => {
          return {
            list: () =>
              Promise.resolve({
                rows: [
                  {
                    id: "displayid:en-US",
                    doc: {
                      display_id: "displayid",
                      language: "en-US",
                      answerText: "testing",
                      timestamp: "timestamp",
                    },
                  },
                ],
              }),
            insert: (name) =>
              Promise.resolve({
                _id: "displayid:en-US",
                display_id: "displayid",
                language: "en-US",
                answerText: "testing",
                timestamp: "timestamp",
              }),
          };
        },
      };
    }
  }

  let answersController;
  let res;
  before(() => {
    mockRequire("@cloudant/cloudant", cloudantMock);

    res = mockRequire.reRequire("express/lib/response");
    sandbox.stub(res, "json");
    sandbox.spy(res, "status");

    answersController = mockRequire.reRequire("../../../server/controllers/answerstore-controller");
  });

  afterEach(() => {
    sandbox.reset();
  });

  after(() => {
    sandbox.restore();
    mockRequire.stopAll();
  });

  it("should return some answers", () => {
    const mockReq = {};

    const resultPromise = answersController.getAnswers(mockReq, res);
    expect(resultPromise).to.eventually.be.fulfilled.then(() => {
      expect(res.status).to.have.been.calledOnceWith(200);
      expect(res.json).to.have.been.calledOnceWith([
        {
          _id: "displayid:en-US",
          display_id: "displayid",
          language: "en-US",
          answerText: "testing",
          timestamp: "timestamp",
        },
      ]);
    });
  });

  it("should correctly add a answer", () => {
    const mockReq = {
      body: {
        id: "id",
        display_id: "displayid",
        language: "en-US",
        answerText: "testing",
        timestamp: "timestamp",
      },
    };

    const resultPromise = answersController.addAnswer(mockReq, res);
    expect(resultPromise).to.eventually.be.fulfilled.then(() => {
      expect(res.status).to.have.been.calledOnceWith(201);
      expect(res.json).to.have.been.calledOnceWith({
        _id: "displayid:en-US",
        display_id: "displayid",
        language: "en-US",
        answerText: "testing",
        timestamp: "timestamp",
      });
    });
  });
});

// example unit tests of export failures in answrs controller
describe("Test failure paths of answer controller", () => {
  class cloudantMock {
    constructor() {
      this.db = {
        create: () =>
          Promise.reject({
            error: "another_error",
          }),
        use: () => {
          return {
            list: () => Promise.reject("There was an error with list."),
            insert: (name) => Promise.reject("There was an error with insert."),
          };
        },
      };
    }
  }

  let answersController;
  let res;
  before(() => {
    mockRequire("@cloudant/cloudant", cloudantMock);

    res = mockRequire.reRequire("express/lib/response");
    sandbox.stub(res, "json");
    sandbox.spy(res, "status");

    answersController = mockRequire.reRequire("../../../server/controllers/answerstore-controller");
  });

  afterEach(() => {
    sandbox.reset();
  });

  after(() => {
    sandbox.restore();
    mockRequire.stopAll();
  });

  it("should fail getting answers", () => {
    const mockReq = {};

    const resultPromise = answersController.getAnswers(mockReq, res);
    expect(resultPromise).to.eventually.be.fulfilled.then(() => {
      expect(res.status).to.have.been.calledOnceWith(500);
      expect(res.json).to.have.been.calledOnceWith({
        message: "Get answers failed.",
        error: "There was an error with list.",
      });
    });
  });

  it("should fail to add a answer", () => {
    const mockReq = {
      body: {
        _id: "id",
        display_id: "display_id",
        language: "en-US",
        answerText: "testing",
        timestamp: "timestamp",
      },
    };

    const resultPromise = answersController.addAnswer(mockReq, res);
    expect(resultPromise).to.eventually.be.fulfilled.then(() => {
      expect(res.status).to.have.been.calledOnceWith(500);
      expect(res.json).to.have.been.calledOnceWith({
        message: "Add answer failed.",
        error: "There was an error with insert.",
      });
    });
  });
});

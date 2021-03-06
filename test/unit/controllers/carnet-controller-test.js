/* eslint no-unused-expressions: 0 */
const chai = require('chai');
const sinon = require('sinon');
const chaiSinon = require('chai-sinon');

const { expect } = chai;
chai.use(chaiSinon);

const carnetController = require('../../../app/controllers/carnet-controller');
const carnetService = require('../../../app/services/carnet-service');

describe('carnet controller', () => {
  describe('getForm', () => {
    let response;
    before(() => {
      response = {
        render: sinon.fake(),
      };
    });
    it('should render the page', () => {
      carnetController.getForm({}, response);

      expect(response.render).to.have.been.called;
    });
  });

  describe('addContact', () => {
    let response;
    let saveFct;
    beforeEach(() => {
      response = {
        render: sinon.fake(),
      };

      saveFct = sinon.stub(carnetService, 'save');
    });
    afterEach(() => {
      saveFct.restore();
    });
    it('should save Alice CANARY', () => {
      const request = {
        body: {
          nom: 'CANARY',
          prenom: 'Alice',
          tel: '0102030405',
        },
      };

      carnetController.addContact(request, response);

      expect(response.render).to.have.been.calledWith('index', { nom: 'CANARY', prenom: 'Alice' });
      expect(saveFct).to.have.been.calledWith(request.body);
    });

    it('should render Bob BABOUCHE', () => {
      const request = {
        body: {
          nom: 'BABOUCHE',
          prenom: 'Bob',
          tel: '0102030405',
        },
      };

      carnetController.addContact(request, response);

      expect(response.render).to.have.been.calledWith('index', { nom: 'BABOUCHE', prenom: 'Bob' });
      expect(saveFct).to.have.been.calledWith(request.body);
    });

    it('should handle and return missings errors from the save function', () => {
      const missingError = { missing: ['tel'] };
      saveFct.returns(missingError);
      const request = {
        body: {
          nom: 'CANARY',
          prenom: 'Alice',
        },
      };

      carnetController.addContact(request, response);

      expect(response.render).to.have.been.calledWith('index', {
        nom: 'CANARY',
        prenom: 'Alice',
        errors: missingError,
      });
      expect(saveFct).to.have.been.called;
    });

    it('should handle and return an errors when two fields are missing', () => {
      const missingError = { missing: ['tel', 'prenom'] };
      saveFct.returns(missingError);
      const request = {
        body: {
          nom: 'CANARY',
        },
      };

      carnetController.addContact(request, response);

      expect(response.render).to.have.been.calledWith('index', {
        nom: 'CANARY',
        prenom: undefined,
        errors: missingError,
      });
      expect(saveFct).to.have.been.called;
    });

    it('should handle and return already exist errors from the save function', () => {
      const alreadyExistError = { exist: true };
      saveFct.returns(alreadyExistError);
      const request = {
        body: {
          nom: 'CANARY',
          prenom: 'Alice',
        },
      };

      carnetController.addContact(request, response);

      expect(response.render).to.have.been.calledWith('index', {
        nom: 'CANARY',
        prenom: 'Alice',
        errors: alreadyExistError,
      });
      expect(saveFct).to.have.been.called;
    });
  });
});

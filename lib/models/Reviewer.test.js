const Reviewer = require('./Reviewer');

describe('Reviewer model', () => {
  const reviewer = new Reviewer({});
  const { errors } = reviewer.validateSync();
  it('has a required name', () => {
    expect(errors.name.message).toEqual('Path `name` is required.');
  });

  it('has a required company', () => {
    expect(errors.company.message).toEqual('Path `company` is required.');
  });
});

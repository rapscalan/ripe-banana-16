const Actor = require('./Actor');

describe('Actor model', () => {
  const actor = new Actor({});

  const { errors } = actor.validateSync();
  it('has a required name', () => {
    expect(errors.name.message).toEqual('Path `name` is required.');
  });
});

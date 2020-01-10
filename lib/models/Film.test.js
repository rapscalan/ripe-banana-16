const Film = require('./Film');
const Studio = require('./Studio');

describe('Film model', () => {
  const film = new Film();

  const { errors } = film.validateSync();

  it('has a required title', () => {
    expect(errors.title.message).toEqual('Path `title` is required.');
  });

  it('has a required studio', () => {
    expect(errors.studio.message).toEqual('Path `studio` is required.');
  });

  it('has a required released', () => {
    expect(errors.released.message).toEqual('Path `released` is required.');
  });

  it('fails with a released of less than 4 digits', () => {
    const studio = new Studio({
      name: 'MGM',
      address: {}
    });
    const film = new Film({
      title: 'On the Waterfront',
      studio: studio._id,
      released: 999,
      cast: {}
    });
    const { errors } = film.validateSync();
    expect(errors.released.message).toEqual('Path `released` (999) is less than minimum allowed value (1000).');
  });

  it('fails with a released of less than 4 digits', () => {
    const studio = new Studio({
      name: 'MGM',
      address: {}
    });
    const film = new Film({
      title: 'On the Waterfront',
      studio: studio._id,
      released: 10000,
      cast: {}
    });
    const { errors } = film.validateSync();
    expect(errors.released.message).toEqual('Path `released` (10000) is more than maximum allowed value (9999).');
  });

});

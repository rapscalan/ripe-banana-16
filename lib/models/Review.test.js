const Review = require('./Review');

describe('Review model', () => {
  const review = new Review();

  const { errors } = review.validateSync();

  it('has a required rating', () => {
    expect(errors.rating.message).toEqual('Path `rating` is required.');
  });

  it('has a required reviewer', () => {
    expect(errors.reviewer.message).toEqual('Path `reviewer` is required.');
  });

  it('has a required review', () => {
    expect(errors.review.message).toEqual('Path `review` is required.');
  });

  it('has a required film', () => {
    expect(errors.film.message).toEqual('Path `film` is required.');
  });

  it('fails on an incorrect rating value', () => {
    const review = new Review({
      rating: 1.43
    });
    const { errors } = review.validateSync();
    expect(errors.rating.message).toEqual(`${review.rating} is not an allowed rating`);
  });
});

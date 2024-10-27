import Joi from 'joi';
import { Movie , MovieValidation} from '../interface/MovieInterface';

class ValidationService {
    private movieSchema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().optional(),
        date: Joi.date().optional()
    });

    validateMovie(data: MovieValidation) {
        return this.movieSchema.validate(data);
    }
}

export default new ValidationService();
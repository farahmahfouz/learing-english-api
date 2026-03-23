import Level from '../models/levelModel';

export const createLevelService = async (data: object) => {
    const level = await Level.create(data);
    return level;
};

export const getAllLevelsService = async () => {
    const levels = await Level.find().select('levelNumber title description');
    return levels;
};

export const getLevelByIdService = async (id: string) => {
    const level = await Level.findById(id);
    return level;
};
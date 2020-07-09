import { db } from '../models/index.js';
import { logger } from '../config/logger.js';

const Grade = db.grade;

const create = async (req, res) => {
  const { name, subject, type, value } = req.body;
  const grade = new Grade({ name, subject, type, value });

  try {
    const data = await grade.save(grade);

    res.status(201).json(data);

    logger.info(`POST /grade - ${JSON.stringify()}`);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  const name = req.query.name;

  var condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  try {
    const allGrades = await Grade.find(condition);

    res.status(200).json(allGrades);
    logger.info(`GET /grade`);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'Erro ao listar todos os documentos' });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const grade = await Grade.findById(id);

    res.status(200).json(grade);

    logger.info(`GET /grade - ${id}`);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching the grade id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: 'Data for empty update',
    });
  }

  const id = req.params.id;

  try {
    await Grade.findByIdAndUpdate({ _id: id }, req.body);

    res.status(200).json({ message: 'The grade was updated successfully!' });

    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res.status(500).json({ message: 'Error updating grade id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    await Grade.deleteOne({ _id: id });
    res.status(200).json({ message: 'The grade was deleted successfully!' });

    logger.info(`DELETE /grade - ${id}`);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'It was not possible to delete the grade id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (_, res) => {
  try {
    await Grade.deleteMany();

    res.status(200).json({ message: 'Grades deleted' });
    logger.info(`DELETE /grade`);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting all grades' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll };

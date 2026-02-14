/**
 * Punto único de acceso a repositorios TypeORM.
 * Centraliza getRepository para evitar duplicación y facilitar refactors.
 */
const AppDataSource = require('./config/database');

function getUsuarioRepo() {
  return AppDataSource.getRepository('Usuario');
}

function getRegistroRepo() {
  return AppDataSource.getRepository('RegistroDiario');
}

function getSemanalRepo() {
  return AppDataSource.getRepository('RegistroSemanal');
}

function getAuditoriaRepo() {
  return AppDataSource.getRepository('Auditoria');
}

function getRoleRepo() {
  return AppDataSource.getRepository('Role');
}

function getPermisoRepo() {
  return AppDataSource.getRepository('PermisoCatalogo');
}

module.exports = {
  getUsuarioRepo,
  getRegistroRepo,
  getSemanalRepo,
  getAuditoriaRepo,
  getRoleRepo,
  getPermisoRepo,
};

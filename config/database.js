import sequelize, {Sequelize} from "sequelize";

const db = new Sequelize('emicadev','openpg','openpgpwd',{
    host: "localhost",
    dialect: "postgres"
});

export default db;


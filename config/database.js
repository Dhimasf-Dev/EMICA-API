import sequelize, {Sequelize} from "sequelize";

const db = new Sequelize('emica-test','openpg','openpgpwd',{
    host: "localhost",
    dialect: "postgres"
});

export default db;


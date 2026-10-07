const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Jogo = sequelize.define("Jogo", {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    plataforma: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("Zerado", "Jogando", "Quero jogar"),
        allowNull: true
    },
    nota: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
});

module.exports = Jogo;
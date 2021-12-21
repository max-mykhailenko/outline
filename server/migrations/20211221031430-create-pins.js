"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("pins", {
      collectionId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "collections",
        },
      },
      teamId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "teams",
        },
      },
      createdById: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
        },
      },
      index: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.addIndex("pins", ["collectionId"]);

    const createdAt = new Date();
    const [documents] = await queryInterface.sequelize.query(`SELECT "id","collectionId","teamId","pinnedById" FROM documents WHERE "pinnedById" IS NOT NULL`);

    for (const document of documents) {
      await queryInterface.sequelize.query(`
        INSERT INTO pins (
          "collectionId",
          "teamId",
          "createdById",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          :collectionId,
          :teamId,
          :createdById,
          :createdAt,
          :updatedAt
        )
      `, {
        replacements: {
          createdById: document.pinnedById,
          documentId: document.id,
          collectionId: document.collectionId,
          teamId: document.teamId,
          updatedAt: createdAt,
          createdAt,
        },
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("pins");
  },
};

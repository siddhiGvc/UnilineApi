

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('UnilineMacMapping', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UID: {
        
        type: Sequelize.STRING,
      },

      MacID: {
        
        type: Sequelize.STRING,
      },
      Location: {
        
        type: Sequelize.STRING,
      },
      City: {
        
        type: Sequelize.STRING,
      },
      SocketNumber: {
        
        type: Sequelize.STRING,
      },
    
      G1: {
        type: Sequelize.STRING,
      },
      G2: {
        type: Sequelize.STRING,
      },
      G3: {
        type: Sequelize.STRING,
      },
      I: {
        type: Sequelize.STRING,
      },
      GF: {
        type: Sequelize.STRING,
      },
      Q: {
        type: Sequelize.STRING,
      },
      Q1: {
        type: Sequelize.STRING,
      },
      T: {
        type: Sequelize.STRING,
      },
      TL: {
        type: Sequelize.STRING,
      },
      S: {
        type: Sequelize.STRING,
      },
      ST: {
        type: Sequelize.STRING,
      },
      F: {
        type: Sequelize.STRING,
      },
      SNoutput: {
        type: Sequelize.STRING,
      },
   
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('UnilineMacMapping'),
  };
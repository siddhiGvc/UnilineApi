module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
      queryInterface.addColumn('UnilineMacMapping', 'lastHeartBeatTime', {
        type: Sequelize.DATE,
        defaultValue: null,
      }),
      
    ]),
  
    down: (queryInterface, Sequelize) => Promise.all([
      queryInterface.removeColumn('UnilineMacMapping', 'lastHeartBeatTime'),
      
      
    ]),
  };
  
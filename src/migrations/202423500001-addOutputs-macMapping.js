module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
      queryInterface.addColumn('MacMapping', 'FWoutput', {
        type: Sequelize.STRING,
        defaultValue: null,
      }),
      queryInterface.addColumn('MacMapping', 'TVoutput', {
        type: Sequelize.STRING,
        defaultValue: null,
      }),
 
      
    ]),
  
    down: (queryInterface, Sequelize) => Promise.all([
      queryInterface.removeColumn('MacMapping', 'FWoutput'),
      queryInterface.removeColumn('MacMapping', 'TVoutput'),
   
      
    ]),
  };
  
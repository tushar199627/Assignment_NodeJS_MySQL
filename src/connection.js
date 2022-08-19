const mysql=require('mysql')

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'files',
    multipleStatements:true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection Successfull.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

module.exports=mysqlConnection



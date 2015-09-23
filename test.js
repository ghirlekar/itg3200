var ITG3200 = require('./index.js'),
    gyro = new ITG3200();

gyro.begin(function(err){
	if(err)	console.log('Error setting up ITG3200: ' + err);
	else console.log('Setup successful')
});

gyro.on('data', function(data){
	console.log(data);
});

 'use strict';

var db = require('../../../../config/sequelize').db;
var commonLib = require('../../../../lib/common');
var mainConfig = require('../../../../config/mainConfig');
var fs = require('fs');

exports.getdevicelist = function(req, res, next) {
 	sequelizeDb.models.device.findAll()
	.then(function(deviceList) {
		if(deviceList)
		{
			res.json({
				status: true,
				data: deviceList,
				message: 'Success to load data..!'
			});
		}
		else {
			res.json({
				status: false,
				data: null,
				message: 'Failed to load data..!'
			});
		}
	});
};

exports.getDeviceId = function(req, res, next) {
    
    var imageFolder = 'public/upload/profilepicture/';

    db.models.device.find({
        attributes:['id', 'name', 'manufacturer', 'firmware', 'version', 'device_image', 'device_group_id'],
        where:{
            id:req.body.id
        }
    })
    .then(function(device) {
        if(device)
        {
            if(!fs.existsSync(imageFolder+device.dataValues.device_image)) {
                device.dataValues.device_image =''; 
            }

            res.json({
                status: true,
                data: device,
                message: 'Device load successfully'
            });
        }
        else {
            res.json({
                status: false,
                data: null,
                message: 'Failed to load data..!'
            });
        }
    });
};



exports.getdeviceGrouplist = function(req, res, next) {
 	
 	var userInfo = generalConfig.getUserInfo(req);
    if (!userInfo.companyId) {
        return res.json({
            status: "fail",
            message: 'Unknown user'
        });
    }

 	db.models.device_group.findAll({
 		attributes: ['id','name'],
 		where: {
 			company_id: userInfo.companyId
 		}
 	})
	.then(function(deviceGroupData) {
		if(deviceGroupData)
		{
			res.json({
				status: true,
				data: deviceGroupData,
				message: 'Success to load data..!'
			});
		}
		else {
			res.json({
				status: false,
				data: null,
				message: 'Failed to load data..!'
			});
		}
	});
};

 exports.addDeviceData = function(req, res, next) {
 	//console.log(req.files);

 	/*var userInfo = generalConfig.getUserInfo(req);
    if (!userInfo.companyId) {
        return res.json({
            status: "fail",
            message: 'Unknown user'
        });
    }*/

    /*var DeviceGroup = req.body.selectegroupId;
    console.log(DeviceGroup);*/
    //var device_Data;

    var deviceData ={};
    /*for (var i =0; i < DeviceGroup.length; i++) {
    	device_Data = DeviceGroup[i];
    }*/

    deviceData["name"] = req.body.name;
    deviceData["manufacturer"] = req.body.manufacturer;
    deviceData["firmware"] = req.body.firmware;
    deviceData["version"] = req.body.version;
    deviceData["device_group_id"] = req.body.device_group_id;

 	if (req.files && req.files.file) {
 	
    	var devicePicture = req.files.file;
    	
    	var options = {
			'uploadedfileobj' : devicePicture,
			'storagepath' : settings.filesPath.userPicture,
			'resizeinfo' : false
		}
		commonLib.storeSFImage(options, function(result) {
			if(result.status) {
				deviceData.device_image = result.data.filename;
				saveDeviceData(deviceData, function(result) {
					if(result.status) { 		
	    				res.json({
	                    	'status': true,
	                    	'message': 'Device Added SuccessFully'
	                   	});                   
	                }
	                else {
	                   	return res.json({
	                    	'status': false,
	                    	'message': 'Failed to add Device'
	                   	});  
	                }
    			}); 					
    		}
        });

    } 
    else {  
        saveDeviceData(device, function(result) {
            if (result.status==true) {
                return res.json({
                    'status': true,
                    'data': result.data,
                    'message': successmsg
                });                   
            } else {  
                return res.json({
                    'status': false,
                    'message': result.message
                });  
            }
        });        
    }
};


var saveDeviceData = function (deviceData, callback) {
    
	db.models.device.create(deviceData).then(function(deviceData) {
		callback ({ 'status': true }); 
	})
    .catch(function(err) {
		callback({
			'status': false,
			'message': err
		});
    });
};

exports.getdeviceListWithPagination = function(req, res, next) {
    
    var pageNumber = req.body.params.pageNumber;
    var pageSize = req.body.params.pageSize;

    db.models.device
    .findAndCountAll({
      //attributes: ['id', 'firstname','lastname','email', 'phone', 'timezone', 'role_id', 'active'],
      offset: pageNumber == '' ? pageNumber : (pageNumber - parseInt(1)) * pageSize,
      limit: pageSize
    })
    .then(function(device) {
        if(device)
        {   
            res.json({
                status: true,
                data: device,
                message: 'Device Load Successfully'
            });
        }
        else {
            res.json({
                status: false,
                data: null,
                message: 'Failed to load data..!'
            });
        }
    }).catch(function(err) {
        console.log(err);
    });
};

exports.deleteDeviceData = function(req, res, next) {
    
    var deviceID = req.params.id;
    db.models.device.destroy({ where: { id: deviceID} })
    .then(function(device) {
        if (device) {
            res.json({
            status: true,
            data: deviceID,
            message: 'Device deleted successfully.'
          });
        }
        else {
            res.json({
                status: false,
                data: null,
                message: 'Failed to delete device.'
            });
        }
    }).catch(function(err){
        res.json({
            status: false,
            data: null,
            message: err.message
        });
    });
};

exports.updateDeviceData = function (req, res, next) {

  var failmsg = 'There was some problem updating device, please try later or contact administrator.';
  var successmsg = 'Device Data has been updated successfully.';

  var deviceID = req.params.id;
  var devicedata = JSON.parse(req.body.deviceData);
  
  db.models.device.findOne({
    where: {
      id: deviceID
    }
  }).then(function (device) {
        device.name  = devicedata.name;
        device.manufacturer = devicedata.manufacturer;
        device.firmware = devicedata.firmware;
        device.version = devicedata.version;
        device.device_group_id = devicedata.device_group_id;
        
        if (req.files && req.files.file) {
            var devicePicture = req.files.file;

            var options = {
                'uploadedfileobj' : devicePicture,
                'storagepath' : settings.filesPath.userPicture,
                'resizeinfo' : false
            }

            commonLib.storeSFImage(options, function(result) {
              if(result.status) {
                commonLib.removeProfilePicture(device.device_image);
                device.device_image = result.data.filename;
                device.save().then(function(result) {
                    if (result.status) {
                        res.json({
                            'status': true,
                            'data': result.data,
                            'message': successmsg,
                        });                   
                    } else {
                        res.json({
                            'status': false,
                            'message': result.message
                        });  
                    }
                });                     
              } else {
                    return res.json({
                        'status': false,
                        'message': failmsg
                    });
                }
            });

        } else {
          
            device.save().then(function(result) {
                if (result.status==true) {
                    return res.json({
                        'status': true,
                        'data': result.data,
                        'message': successmsg
                    });                   
                } else {  
                    return res.json({
                        'status': false,
                        'message': result.message
                    });  
                }
            });        
        }
    })
};


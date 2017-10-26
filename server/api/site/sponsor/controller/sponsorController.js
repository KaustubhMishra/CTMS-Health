'use strict';
var db = require('../../../../config/sequelize').db;
var Sequelize = require("sequelize");

db.models.trial.associate(sequelizeDb.models);
	
exports.getallSponsors = function(req, res, next) {
 	db.models.sponsor.findAll()
	.then(function(sponsors) {
		if(sponsors)
		{
			res.json({
				status: true,
				data: sponsors,
				message: 'Sponsors load successfully'
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

 exports.getSponsors = function(req, res, next) {
 	
    var pageNumber = req.body.params.pageNumber;
    var pageSize = req.body.params.pageSize;

 	db.models.sponsor.findAndCountAll({
 		offset: pageNumber == '' ? pageNumber : (pageNumber - parseInt(1)) * pageSize,
      	limit: pageSize
    })
	.then(function(sponsors) {
		if(sponsors)
		{
			res.json({
				status: true,
				data: sponsors,
				message: 'Sponsors load successfully'
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

exports.getSponsorsId = function(req, res, next) {

 	db.models.sponsor.find({
 		where:{
 			id:req.body.id
 		}
    })
	.then(function(sponsors) {
		if(sponsors)
		{
			res.json({
				status: true,
				data: sponsors,
				message: 'Sponsors load successfully'
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

exports.savedSponsor = function(req, res, next) {
	
	var state= {}; 
	if(req.body.state1) {
		state= req.body.state1;
	} else {
		state= req.body.state;
	}
	console.log(state); 
	
	var data = {
		"company_id" : req.body.company_id,
		"sponsor_company" : req.body.sponsor_company,
		"contact_name" : req.body.contact_name,
		"email_address" : req.body.email_address,
		"contact_number" : req.body.contact_number,
		"contact_address_1" : req.body.contact_address_1,
		"contact_address_2" : req.body.contact_address_2,
		"city" : req.body.city,
		"state" :state,
		"country" : req.body.country,
		"zip" : req.body.zip
	};

	console.log(data);
	db.models.sponsor.find({
		where: {
            email_address: req.body.email_address
        }
	}).then(function(findSponsor) {
		if(findSponsor) {
            console.log(findSponsor);
            return res.json({
                status: 'fail',
                data: null,
                message: 'Sponsor already exist'
            });
        } else {
        	sequelizeDb.models.sponsor.create(data)
			.then(function(sponsors) {
				if(sponsors)
				{
					res.json({
						status: true,
						data: sponsors,
						message: 'Data saved successfully..!'
					});
				}
				else {
					res.json({
						status: false,
						data: null,
						message: 'Failed to save data..!'
					});
				}
			});
        }
	}).catch(function(err) {
        console.log(err);
    }); 
};


exports.updateSponsor = function(req, res, next) {
	
	var state= {}; 
	
	if(req.body.state1) {
		state= req.body.state1;
	} else {
		state= req.body.state;
	}
	console.log(state); 
	
	var data = {
		"company_id" : "e2bf5889-a22d-49f5-bf51-8bc2f02178c4",
		"sponsor_company" : req.body.sponsor_company,
		"contact_name" : req.body.contact_name,
		"email_address" : req.body.email_address,
		"contact_number" : req.body.contact_number,
		"contact_address_1" : req.body.contact_address_1,
		"contact_address_2" : req.body.contact_address_2,
		"city" : req.body.city,
		"state" : state,
		"country" : req.body.country,
		"zip" : req.body.zip
	};
	var sponsorID = req.params.id;
	sequelizeDb.models.sponsor.find({ where: { id: sponsorID} })
	.then(function(sponsor) {
		if (sponsor) {

			db.models.sponsor.find({
				where: {
		            email_address: req.body.email_address,
		            id: {
				      $ne: sponsorID
				    }
		        }
			}).then(function(findSponsor) {
				if(findSponsor) {
		            console.log(findSponsor);
		            return res.json({
		                status: 'fail',
		                data: null,
		                message: 'Sponsor already exist'
		            });
		        } else {

				    sequelizeDb.models.sponsor.update(data,{
							where: { id: sponsorID}
					}).then(function (result) {
							res.json({
						  	status: true,
						  	data: result,
						  	message: 'Data updated successfully..!'
						  });
				  	});
		        }
			}).catch(function(err) {
		        console.log(err);
		    });

	  	} else {
			res.json({
				status: false,
				data: null,
				message: 'Data not found to update..!'
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


exports.deleteSponsorData = function(req, res, next) {
	
	var sponsorID = req.params.id;
	
	sequelizeDb.models.trial.find({
		where:{
			sponsor_id: sponsorID
		}
	}).then(function (data) {
		if(data){
			res.json({
		  	status: false,
		  	data: null,
		  	message: 'You can not delete this sponsor. Trial attached with this sponsor..!'
		  });
		}
	})
	sequelizeDb.models.sponsor.destroy({ where: { id: sponsorID} })
	.then(function(sponsor) {
		if (sponsor) {
			res.json({
		  	status: true,
		  	data: sponsorID,
		  	message: 'Data removed successfully..!'
		  });
	  }
	  else {
			res.json({
				status: false,
				data: null,
				message: 'Data not found to remove..!'
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

exports.getSponsorsDSMB = function(req, res, next) {
 	
 	var userInfo = generalConfig.getUserInfo(req);
 	var dsmbId = userInfo.id;
 	
 	db.models.trial.findAll({
 		attributes: ['sponsor_id'],
 		where:{
 			dsmb_id: dsmbId
 		}
 	}).then(function(trialData) {
 		var data ={};
 		var resultData =[];
 		for (var i = 0; i < trialData.length; i++) {
 			data = trialData[i].dataValues.sponsor_id;
 			resultData.push(data);
 		}
		db.models.sponsor.findAll({
			where:{
				id: resultData
			}
		}).then(function(result){
			if(result)
			{
				res.json({
					status: true,
					data: result,
					message: 'Sponsors load successfully for DSMB'
				});
			}
			else {
				res.json({
					status: false,
					data: null,
					message: 'Failed to load data..!'
				});
			}
		}).catch(function(err){
			res.json({
				status: false,
				data: null,
				message: err.message
			});
		});
	});
};

exports.getSponsorsCRO = function(req, res, next) {
 	
 	var userInfo = generalConfig.getUserInfo(req);
 	var croCoordinatorId = userInfo.id;
 	
 	db.models.trial.findAll({
 		attributes: ['sponsor_id'],
 		where:{
 			croCoordinator_id: croCoordinatorId
 		}
 	}).then(function(trialData) {
 		var data ={};
 		var resultData =[];
 		for (var i = 0; i < trialData.length; i++) {
 			data = trialData[i].dataValues.sponsor_id;
 			resultData.push(data);
 		}
		db.models.sponsor.findAll({
			where:{
				id: resultData
			}
		}).then(function(result){
			if(result)
			{
				res.json({
					status: true,
					data: result,
					message: 'Sponsors load successfully for Cro Coordinator'
				});
			}
			else {
				res.json({
					status: false,
					data: null,
					message: 'Failed to load data..!'
				});
			}
		}).catch(function(err){
			res.json({
				status: false,
				data: null,
				message: err.message
			});
		});
	});
};


// You can reference the input variables using input.NAME
exports.step = function(input) {
​
	/*
	All contacts passed have been filtered by addedAt timestamp.
	*/
​
	//We will add each contact w/ their properties to this list. The list gets returned at the end.
	var contactList = [];
	var currentTime = moment( new Date() );
​
	//Loop through each contact from Hubspot, pulling out only the necessary properties.
	_.forEach(input.contacts, function(contact) {
​
		var contactDetails = {};
​
		//Create an array to capture all the form items
		contactDetails["forms"] = [];
		/*
		The contactDetails["forms"] will look like this on output:
		[
			{ "id": <form-id-1>, "name": <form-title-1>},
			{ "id": <form-id-2>, "name": <form-title-2>},
			... etc.
		]
		*/
​
		//We want to capture all the form-id and names apart of all the form submissions this contact has.
		_.forEach( contact["form-submissions"], function(submission) {
​
			//Create our form items (We can add whatever values are important to capture. Right now just ID and title)
			var formItem = {};
			formItems["id"] = submission["form-id"];
			formItems["name"] = submission["title"];
​
			//Add our form items to the list.
			contactDetails["forms"].push( formItem );
		});
​
		//The email address is buried within the contact info. The following loops through the structure till we find the email.
		_.forEach( contact["identity-profiles"], function(profile) {
			_.forEach( profile["identities"], function(identity) {
				if( identity.type == "EMAIL" ) 
				{
					contactDetails["email"] = identity.value;
				}
			});
		});
​
		//We need to grab the properties for this contact, but sometimes they don't exist.
		//We need to check that each value exists before we pull the data.
​
		if( "properties" in contact )
		{
			contactDetails["firstname"] = "firstname" in contact.properties ? contact.properties.firstname.value : "";
			contactDetails["lastname"] = "lastname" in contact.properties ? contact.properties.lastname.value : "";
			contactDetails["company"] = "company" in contact.properties ? contact.properties.company.value : "";
			contactDetails["job"] = "jobtitle" in contact.properties ? contact.properties.jobtitle.value : "";
			contactDetails["custom_fields"] = contact.properties;
		}else{
			contactDetails["firstname"] = "";
			contactDetails["lastname"] = "";
			contactDetails["company"] = "";
			contactDetails["job"] = "";
			contactDetails["title"] = "";
			contactDetails["custom_fields"] = null; 
		}
​
		//Contact is built push to list.
		contactList.push( contactDetails );
	});
​
	return contactList;
};

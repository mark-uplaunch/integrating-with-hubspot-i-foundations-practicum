const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';


// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const vehicles = `https://api.hubspot.com/crm/v3/objects/2-217083325?properties=name,type,brand`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(vehicles, { headers });
        const data = resp.data.results;
        //console.log(data);
        res.render('homepage', { title: 'Vehicles | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }


  res.render('homepage');
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
    const vehicles = `https://api.hubspot.com/crm/v3/objects/2-217083325?properties=name,type,brand`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(vehicles, { headers });
        const data = resp.data.results;
        //console.log(data);   
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', data });  
    } catch (error) {
        console.error(error);
    }

    
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    //Separate items to update and create
    const { to_update, to_create } = req.body.vehicles.reduce(
        (result, vehicle) => {
            const payload = {
            properties: {
                name: vehicle.name,
                brand: vehicle.brand,
                type: vehicle.type
            }
            };

            if (vehicle.id) {
            result.to_update.push({
                id: vehicle.id,
                ...payload
            });
            } else {
            const hasValues = [vehicle.name, vehicle.brand, vehicle.type]
                .some(value => value && value.trim() !== '');

            if (hasValues) {
                result.to_create = payload;
            }
            }

            return result;
        },
        {
            to_update: [],
            to_create: null
        }
    );

    //Handle record update (By Batch)
    const update_payload = JSON.stringify({
        inputs: to_update
    })
    
    const updateVehicles = `https://api.hubapi.com/crm/v3/objects/2-217083325/batch/update`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(updateVehicles, update_payload, { headers } );
        
    } catch(err) {
        console.error(err);
    }

    //Handle single record creation
    if(!to_create) { res.redirect('/'); }
    else {
        const createVehicle = `https://api.hubapi.com/crm/v3/objects/2-217083325`;
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        };
        try { 
            await axios.post(createVehicle, to_create, { headers } );
            res.redirect('/');
        } catch(err) {
            console.error(err);
        }
    }
});
// * Code for Route 3 goes here

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
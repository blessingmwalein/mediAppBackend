'use strict'
 
const District = use('App/Models/District')
const Hospital =use('App/Models/Hospital')
class DistrictController {

    async index({response}){
    //   const districts =await District.all()

    //   return response.json(districts)

      const districts = await District
                        .query()
                        .with('hospitals')
                        .fetch()
     return response.json(districts)

    }

    async store({request, response}){
        const districtInfo =request.only(['name'])

        
        const district = await District.create({
            name:districtInfo.name,
        })

        return response.status(201).json(district)

    }
    async show({params, response}){
     const district =  await District.find(params.id)

     const hospitals = await Hospital.where('district_id').eq(params.id).fetch()
     return response.json({_id:district._id,name:district.name, hospitals:hospitals});
    }
}

module.exports = DistrictController

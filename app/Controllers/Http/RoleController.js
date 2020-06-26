'use strict'
const Role = use('App/Models/Role')

class RoleController {

    async index({ response }) {
        const roles = await Role.all()
        return response.json(roles)
    }

    async store({ response, request }) {
        const roleInfo = request.all()

        const role = await Role.create({ name: roleInfo.name })
        return response.json(role)
    }
}
module.exports = RoleController

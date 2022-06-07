'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const hashing = await import('../helpers/hashing.js')
    const User = await import('./../models/user.js')
    const Role = await import('./../models/role.js')
    const RoleUser = await import('./../models/roleuser.js')
    const PermissionRole = await import('./../models/permissionrole.js')
    const Permission = await import('./../models/permission.js')
    const roleConstant = await import('./../constants/roles.js')
        
    const userRoleRepository = await import('./../repositories/roleuser.js')
    const permissionRoleRepository = await import('./../repositories/permissionrole.js')

    await Role.default.destroy({where: {}, truncate: true, cascade: true, restartIdentity:true})
    await Permission.default.destroy({where: {}, truncate: true, cascade: true, restartIdentity:true})
    await User.default.destroy({where: {}, truncate: true, cascade: true, restartIdentity:true})
    await PermissionRole.default.destroy({where: {}, truncate: true, cascade: true, restartIdentity:true})
    await RoleUser.default.destroy({where: {}, truncate: true, cascade: true, restartIdentity:true})

    await Role.default.bulkCreate([
      { name: roleConstant.default.ROLE_SUPER_ADMIN },
      { name: roleConstant.default.ROLE_ADMIN },
      { name: roleConstant.default.ROLE_MODERATOR },
      { name: roleConstant.default.ROLE_AUTHENTICATED },
    ]);

    const actions = [
      'create',
      'read',
      'update',
      'delete'
    ]

    const modules = [
      'user',
      'permission',
      'role',
      'role-matrix'
    ]

    await Permission.default.bulkCreate([
      { name: roleConstant.default.PERMISSION_VIEW_ADMIN_DASHBOARD },
      { name: roleConstant.default.PERMISSION_VIEW_ALL_USERS },
      { name: roleConstant.default.PERMISSION_VIEW_ALL_USERS },
    ]);

    const superAdminUser = await User.default.create({
      name: 'Aulia',
      email: 'aulia@aulia.com',
      password: hashing.default.createHash('password123'),
      phone: '+2348123456789',
    });

    const superAdminRole = await Role.default.findOne({ where: { name: roleConstant.default.ROLE_SUPER_ADMIN } });
    const superAdminPermissions = await Permission.default.findAll({
      where: {
        name: [
          roleConstant.default.PERMISSION_VIEW_ADMIN_DASHBOARD,
          roleConstant.default.PERMISSION_VIEW_ALL_USERS,
        ],
      },
    });

    const userRoleRepositoryClass = new userRoleRepository.default
    const permissionRoleRepositoryClass = new permissionRoleRepository.default

    //assign role
    await userRoleRepositoryClass.addRole(superAdminUser.id, superAdminRole.id);
    //assign permission
    for (const perm of superAdminPermissions) {
      await permissionRoleRepositoryClass.addPermissionRole(perm.id, superAdminRole.id)
    }

    for (const module of modules) {
      for (const action of actions) {
        let permission = await Permission.default.create({
          name: `${action}-${module}`
        })
        await permissionRoleRepositoryClass.addPermissionRole(permission.id, superAdminRole.id)
      }  
    }
    
  },

  async down (queryInterface, Sequelize) {
    const User = await import('./../models/user.js')
    const Role = await import('./../models/role.js')
    const RoleUser = await import('./../models/roleuser.js')
    const Permission = await import('./../models/permission.js')
    const PermissionRole = await import('./../models/permissionrole.js')

    await Role.default.destroy({where: {}, truncate: true, cascade: true, restartIdentity:true})
    await Permission.default.destroy({where: {}, truncate: true, cascade: true, restartIdentity:true})
    await User.default.destroy({where: {}, truncate: true, cascade: true, restartIdentity:true})
    await PermissionRole.default.destroy({where: {}, truncate: true, cascade: true, restartIdentity:true})
    await RoleUser.default.destroy({where: {}, truncate: true, cascade: true, restartIdentity:true})
  }
}
// RolModel.js
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
const { Schema } = mongoose;

const permissionsSchema = new Schema({
  mesa: {
    crear: {
      type: Boolean,
      default: false
    },
    eliminar: {
      type: Boolean,
      default: false
    }
  },
  ticket: {
    pagar: {
      type: Boolean,
      default: false
    },
    descargar: {
      type: Boolean,
      default: false
    },
    imprimir: {
      type: Boolean,
      default: false
    },
  },
  meta: {
    crear: {
      type: Boolean,
      default: false
    }
  },
  order: {
    cancelar: {
      type: Boolean,
      default: false
    },
    crear: {
      type: Boolean,
      default: false
    }
  },
});

const RolSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  permissions: {
    type: permissionsSchema,
    // default: {
    //   eliminarUsuario: false,
    //   agregarUsuario: false,
    //   actualizarUsuario: false,
    //   eliminarProducto: false,
    //   agregarProducto: false,
    //   actualizarProducto: false,
    // }
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const RolModel = mongoose.models.Rol || mongoose.model('Rol', RolSchema);

export default RolModel;

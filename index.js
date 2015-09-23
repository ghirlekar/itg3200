var i2c = require('i2c'),
    util = require('util'),
    async = require('async'),
    EventEmitter = require('events').EventEmitter;

module.exports = ITG3200;
util.inherits(ITG3200, EventEmitter);

function ITG3200(options) {
    EventEmitter.call(this);
    options = options || {
        address: 0x68
    };
    var _ADDRESS = options.address,
        _REG_SMPLRT_DIV = 0x15,
        _REG_DLPF_FS = 0x16,
        _REG_GYRO_OUT = 0x1D;

    var _SMPLRT_DIV = 9,
        _DLPF_CFG = (0 << 2) | (1 << 1) | (1 << 0),
        _DLPF_FS_SEL = (1 << 3) | (1 << 4);
}

ITG3200.prototype.begin = function(callback) {
    this._wire = new i2c(_ADDRESS, {
        device: '/dev/i2c-1'
    });
    async.series([
        function(cb) {
            self.wire.writeByte(_REG_DLPF_FS, [_DLPF_CFG | _DLPF_FS_SEL], function(err) {
                if (err) cb(err);
                else cb(null);
            });
        },
        function(cb) {
            self.wire.writeByte(_REG_SMPLRT_DIV, [_SMPLRT_DIV], function(err) {
                if (err) cb(err);
                else cb(null);
            })
        },
        function(cb) {
            self.wire.stream(_REG_GYRO_OUT, 6, 10);
            self.wire.on('data', function(data) {
                self.emit('data', data);
            });
        }
    ], function(err) {
        if (err) callback(err);
        else callback(null);
    });
}

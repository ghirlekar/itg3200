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

    var _wire;
}

ITG3200.prototype.begin = function(callback) {
    this._wire = new i2c(this._ADDRESS, {
        device: '/dev/i2c-1'
    });
    var self = this;
    async.series([
        function(cb) {
            self._wire.writeByte(self._REG_DLPF_FS, [self._DLPF_CFG | self._DLPF_FS_SEL], function(err) {
                if (err) cb(err);
                else cb(null);
            });
        },
        function(cb) {
            self._wire.writeByte(self._REG_SMPLRT_DIV, [self._SMPLRT_DIV], function(err) {
                if (err) cb(err);
                else cb(null);
            })
        },
        function(cb) {
            self._wire.stream(self._REG_GYRO_OUT, 6, 10);
            self._wire.on('data', function(data) {
                self.emit('data', data);
            });
        }
    ], function(err) {
        if (err) callback(err);
        else callback(null);
    });
}

var util = require('util'),
    events = require('events'),
    _ = require('underscore');

// ---------------------------------------------
// Constructor
// ---------------------------------------------
function Stopwatch() {
    if (false === (this instanceof Stopwatch)) {
        return new Stopwatch();
    }

    this.second = 1000;
    this.time = 30 * this.second;
    this.interval = undefined;

    events.EventEmitter.call(this);

    // Define the methods first
    this.start = function() {
        if (this.interval) {
            return;
        }

        console.log('Starting Stopwatch!');
        this.interval = setInterval(this.onTick, this.second);
        this.emit('start:stopwatch');
    };

    this.stop = function() {
        clearInterval(this.interval);
        this.interval = undefined;
        this.emit('stop:stopwatch');
    };

    this.reset = function() {
        this.time = 30 * this.second;
        this.emit('reset:stopwatch', this.formatTime(this.time));
    };

    this.onTick = function() {
        this.time -= this.second;
        var formattedTime = this.formatTime(this.time);
        this.emit('tick:stopwatch', formattedTime);
        
        if (this.time === 0) {
            this.restart();
        }
    };

    this.formatTime = function(time) {
        var remainder = time,
            numSeconds,
            output = "";

        numSeconds = String(parseInt(remainder / this.second, 10));
        output = _.map([numSeconds], function(str) {
            if (str.length === 1) {
                str = "0" + str;
            }
            return str;
        }).join(":");

        return output;
    };

    this.getTime = function() {
        return this.formatTime(this.time);
    };

    // Bind methods to the current instance (this)
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
    this.onTick = this.onTick.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.getTime = this.getTime.bind(this);
};

// ---------------------------------------------
// Inherit from EventEmitter
// ---------------------------------------------
util.inherits(Stopwatch, events.EventEmitter);

// ---------------------------------------------
// Export
// ---------------------------------------------
module.exports = Stopwatch;

﻿import Logging = require("./Logging");

class Util {
    public static MAX_PROPERTY_LENGTH = 1024;
    private static document:any = typeof document !== "undefined" ? document : {};

    /**
     * helper method to access userId and sessionId cookie
     */
    public static getCookie(name, cookie) {
        var value = "";
        if (name && name.length && typeof cookie === "string") {
            var cookieName = name + "=";
            var cookies = cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                cookie = Util.trim(cookie);
                if (cookie && cookie.indexOf(cookieName) === 0) {
                    value = cookie.substring(cookieName.length, cookies[i].length);
                    break;
                }
            }
        }

        return value;
    }

    /**
     * helper method to trim strings (IE8 does not implement String.prototype.trim)
     */
    public static trim(str:string):string {
        if(typeof str === "string") {
            return str.replace(/^\s+|\s+$/g, "");
        } else {
            return "";
        }
    }

    /**
     * generate GUID
     */
    public static newGuid() {
        var hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

        // c.f. rfc4122 (UUID version 4 = xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
        var oct = "", tmp;
        for (var a = 0; a < 4; a++) {
            tmp = (4294967296 * Math.random()) | 0;
            oct += hexValues[tmp & 0xF] + hexValues[tmp >> 4 & 0xF] + hexValues[tmp >> 8 & 0xF] + hexValues[tmp >> 12 & 0xF] + hexValues[tmp >> 16 & 0xF] + hexValues[tmp >> 20 & 0xF] + hexValues[tmp >> 24 & 0xF] + hexValues[tmp >> 28 & 0xF];
        }

        // "Set the two most significant bits (bits 6 and 7) of the clock_seq_hi_and_reserved to zero and one, respectively"
        var clockSequenceHi = hexValues[8 + (Math.random() * 4) | 0];
        return oct.substr(0, 8) + "-" + oct.substr(9, 4) + "-4" + oct.substr(13, 3) + "-" + clockSequenceHi + oct.substr(16, 3) + "-" + oct.substr(19, 12);
    }

    /**
     * Check if an object is of type Array
     */
    public static isArray(obj:any):boolean {
        return Object.prototype.toString.call(obj) === "[object Array]";
    }

    /**
     * Check if an object is of type Error
     */
    public static isError(obj:any):boolean {
        return Object.prototype.toString.call(obj) === "[object Error]";
    }

    /**
     * Check if an object is of type Date
     */
    public static isDate(obj:any):boolean {
        return Object.prototype.toString.call(obj) === "[object Date]";
    }

    /**
     * Convert ms to c# time span format
     */
    public static msToTimeSpan(totalms:number):string {
        if (isNaN(totalms) || totalms < 0) {
            totalms = 0;
        }

        var ms = "" + totalms % 1000;
        var sec = "" + Math.floor(totalms / 1000) % 60;
        var min = "" + Math.floor(totalms / (1000 * 60)) % 60;
        var hour = "" + Math.floor(totalms / (1000 * 60 * 60)) % 24;

        ms = ms.length === 1 ? "00" + ms : ms.length === 2 ? "0" + ms : ms;
        sec = sec.length < 2 ? "0" + sec : sec;
        min = min.length < 2 ? "0" + min : min;
        hour = hour.length < 2 ? "0" + hour : hour;

        return hour + ":" + min + ":" + sec + "." + ms;
    }

    /**
     * Validate that an object is of type { [key: string]: string }
     */
    public static validateStringMap(obj: any): { [key: string]: string } {
        var map: { [key: string]: string };
        if(typeof obj === "object") {
            map = <{ [key: string]: string }>{};
            for (var field in obj) {
                var property = obj[field];
                var propertyType = typeof property;
                if (propertyType !== "string") {
                    if (property && typeof property.toString === "function") {
                        property = property.toString();
                    } else {
                        property = "invalid property type: " + propertyType;
                    }
                }

                map[field] = property.trim(0, Util.MAX_PROPERTY_LENGTH);
            }
        } else {
            Logging.info("Invalid properties dropped from payload");
        }

        return map;
    }
}
export = Util;
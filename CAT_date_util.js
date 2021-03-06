/************************************************************************************
 * @file 		[CAT] Date Library (CAT_date_util.js)
 * Description: Library used for manipulating Dates Including
 *              - Adding Days
 *                  CATDATE.addDays

 *              - Subtracting Days
 *                  CATDATE.subtractDays

 *              - Convert minutes to decimal hours
 *                  CATDATE.minsToDecHours

 *              - Convert minutes to hours / mins
 *                  CATDATE.minsToHoursMins

 *              - Establish if one date is later than another
 *                  CATDATE.laterDate

 *              - Establish working days between 2 dates - note excludes the input dates
 *                  CATDATE.workingDays
 *
 * @copyright 	© 2020 Catalyst IT Solutions Ltd
 * @author      Neil Elliott July 2020
 * @NApiVersion 2.x
 * @NModuleScope Public
 *
 * Usage:       Include module in script via AMDjs's define function dependencies argument:
 * 				define(['../CATDATE'], function (CATDATE) {});
 *
 * Versions: 	1.0.0 - 04/07/2020 - Initial release - Neil Elliott
 *
 ************************************************************************************/
define([
    'N/util'
    ,  'N/error'
], function (Util, Error){
    /**
     * @method addDays
     * @description adds days to an input date
     * @param {Object} options
     * @param {Date} options.iDate Base Date
     * @param { number } options.days Number of days to be added
     * @return {Date}
     */
    function addDays(options){
        var params = {
            iDate: '',
            days: ''

        };
        Util.extend(params, options);
        _validateRequiredArguments(params, ['iDate','days']);

        var daysMS = options.days * 86400000;
        var today = options.iDate.getTime();
        var later = Number(today) + Number(daysMS);

        return new Date(later)
    }
    /**
     * @method subtractDays
     * @description subtracts days from an input date
     * @param {Object} options
     * @param {Date} options.iDate Base Date
     * @param {number} options.days Number of days to be subtracted
     * @return {Date}
     */
    function subtractDays(options){
        var params = {
            iDate: '',
            days: ''

        };
        Util.extend(params, options);
        _validateRequiredArguments(params, ['iDate','days']);

        var daysMS = options.days * 86400000;
        var today = options.iDate.getTime();
        var earlier = Number(today) - Number(daysMS);
        return  new Date(earlier)
    }
    /**
     * @method minsToDecHours
     * @description returns minutes as decimal hour(s)
     * @param {Object} options
     * @param {number} options.minutes Number of minutes to be converted
     * @return {number}
     */
    function minsToDecHours(options){
        // returns minutes as decimal hour(s)
        // i.e 150 mins = 2.5 hours
        var params = {
            minutes: ''
        };
        Util.extend(params, options);
        _validateRequiredArguments(params, ['minutes']);

        var fullHours = Math.floor(options.minutes/60);
        var mins = ((options.minutes%60)/60||0);
        mins = Number(mins.toFixed(2));
        var theValue = fullHours + mins;
        return(theValue)
    }
    /**
     * @method minsToHoursMins
     * @description returns hours and mins as an array
     * @param {Object} options
     * @param {number} options.minutes Number of minutes to convert
     * @return {Array}
     */
    function minsToHoursMins(options){
        // returns hours and mins as an array
        // i.e. 150 is 2 hours 30, so [2,30]
        var params = {
            minutes: ''
        };
        Util.extend(params, options);
        _validateRequiredArguments(params, ['minutes']);

        var fullHours = Math.floor(options.minutes/60);
        var mins = options.minutes%60||0;
        var theValue = [fullHours,mins];
        return(theValue)
    }
    /**
     * @method workingDays
     * @description returns working days between two dates
     * @param {Object} options
     * @param {Date} options.startDate Starting Date
     * @param {Date} options.endDate Ending Date
     * @param {Boolean} options.included States whether to include the start/end date
     * @return {number}
     */
    function workingDays(options)
    {
        //This will give you the working days between two dates
        // the "include"parameter dictates if you would like to include the start / end days
        // i.e. Friday 26 June 2020 to Tuesday 30 June 2020 is 1 working day, Monday. if "includes" is false
        var params = {
            startDate: '',
            endDate: ''
        };
        Util.extend(params, options);
        _validateRequiredArguments(params, ['startDate', 'endDate']);

        var totalDays = 0;
        var startDate = options.startDate;
        var endDate = options.endDate;
        var included = options.included;

        var curStartDate = new Date();
        curStartDate.setFullYear(startDate.getFullYear());
        curStartDate.setMonth(startDate.getMonth());
        var sDate = startDate.getDate();
        (included)?sDate:sDate++;
        curStartDate.setDate(sDate);

        var curEndDate = new Date();
        curEndDate.setFullYear(endDate.getFullYear());
        curEndDate.setMonth(endDate.getMonth());
        var eDate = endDate.getDate();
        (included)?eDate:eDate--;
        curEndDate.setDate(eDate);

        if(curStartDate >= curEndDate){return 0;}

        while (curStartDate.getTime() <= curEndDate.getTime())
        {
            var dayOfWeek = curStartDate.getDay();
            if((dayOfWeek !== 6) && (dayOfWeek !== 0)){totalDays++;}
            curStartDate.setDate(curStartDate.getDate() + 1);
        }
        return totalDays;
    }
    /**
     * @method laterDate
     * @description returns 0 for the first date, 1 for the second date, -1 if dates are equal
     * @param {Object} options
     * @param {Date} options.dateZero First base date to compare with
     * @param {Date} options.dateOne  Second base date to compare with
     * @return {number}
     */
    function laterDate(options){
        // first date greater returns 0, second date later returns 1 (think array indices!)
        // matched dates = -1,
        var params = {
            dateZero: '',
            dateOne: ''
        };
        Util.extend(params, options);
        _validateRequiredArguments(params, ['dateZero', 'dateOne']);

        if (params.dateZero.getTime() === params.dateOne.getTime() || (params.dateZero==='' || params.dateOne==='')){ return -1}
        if(params.dateZero.getTime() > params.dateOne.getTime()) {return 0}
        return 1;
    }
    /**
     * @method setEndOfDay
     * @description returns a given date setting the time to 17:00:00
     * @param {Object} options
     * @param {Date} options.iDate Base Date
     * @param {number} options.endHour Hour you wish the return date to be set to NB 24 hour clock
     * @param {number} options.endMins Minutes you wish the return date to be set to
     * @return {Date}
     */
    function setEndOfDay(options){
        var params = {
            iDate:'',
            endHour: '',
            endMins: ''
        };
        Util.extend(params, options);
        _validateRequiredArguments(params, ['iDate', 'endHour','endMins']);

        var retDate = new Date(options.iDate.valueOf());
        var offset = retDate.getTimezoneOffset()/60||0;
        var endTime = (options.endHour)-offset;
        retDate.setHours(endTime);
        var endMins = options.endMins;
        retDate.setMinutes(endMins);
        retDate.setSeconds(0);
        return retDate
    }
    /**minsToDecHours
     * @method setStartOfDay
     * @description returns a given date setting the time to 0:00:00
     * @param {Object} options
     * @param {Date} options.iDate Input date to be used as the base
     * @param {number} options.startHour Hour to set the date to i.e 17 for 5pm
     * @param {number} options.startMins Minutes to set the date to i.e. 30 for half past
     * @return {Date}
     */
    function setStartOfDay(options){
        var params = {
            iDate:'',
            startHour: '',
            startMins: ''
        };
        Util.extend(params, options);
        _validateRequiredArguments(params, ['iDate', 'startHour','startMins']);

        var retDate = new Date(options.iDate.valueOf());
        var offset = retDate.getTimezoneOffset()/60||0;
        var startHour = (options.startHour)-offset;
        retDate.setHours(startHour);
        var startMins = options.startMins||0;
        retDate.setMinutes(startMins);
        retDate.setSeconds(0);
        return retDate
    }
    function _validateRequiredArguments(params, requiredParamArray)
    {
        var missingParams = [];

        // Loop over required parameters
        for (var i = 0; i < requiredParamArray.length; i++){
            // If the value is falsy and not 0 (as zero is valid but falsy)
            if (!params[requiredParamArray[i]] && params[requiredParamArray[i]] !== 0){
                missingParams.push(requiredParamArray[i]);
            }
        }

        if (missingParams.length){
            throw Error.create({
                name: 'MISSING_REQD_ARGUMENT',
                message: 'A required argument is missing: ' + missingParams.join(', ') + '.',
                notifyOff: true
            });
        }
    }

    /**
     * @enum shortMonth
     * @type {{"0": string, "11": string, "1": string, "2": string, "3": string, "4": string, "5": string, "6": string, "7": string, "8": string, "9": string, "10": string}}
     */
    var shortMonth = {
        0:"Jan",
        1:"Feb",
        2:"Mar",
        3:"Apr",
        4:"May",
        5:"Jun",
        6:"Jul",
        7:"Aug",
        8:"Sep",
        9:"Oct",
        10:"Nov",
        11:"Dec"
    };

    return {
    // @method addDays
        addDays: addDays
    // @method subtractDays
    ,   subtractDays: subtractDays
    // @method minsToDecHours
    ,   minsToDecHours: minsToDecHours
    // @method minsToHoursMins
    ,   minsToHoursMins: minsToHoursMins
    // @method laterDate
    ,   laterDate: laterDate
    // @method workingDays
    ,   workingDays: workingDays
    // @method setEndOfDay
    ,   setEndOfDay: setEndOfDay
    // @method setStartOfDay
    ,   setStartOfDay: setStartOfDay
};
});
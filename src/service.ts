/**
 * @file Homekit Service Wrapper
 * @author MohammadHossein Abedinpour <abedinpourmh@gmail.com>
 * @licence Apache2
 */

import Accessory from './accessory';
import Characteristic from './Characteristic';

export default class Service {
    /**
     * @property ID of the service / must be unique at accessory level
     * @private
     */
    private ID: number;

    /**
     * @property Service Type
     * @private
     */
    private type: string;

    /**
     * @property List of characteristics of the service
     * @private
     */
    private characteristics: { [index: number]: Characteristic } = {};

    /**
     * @property Whether or not this is a primary service
     * @private
     */
    private isPrimary: boolean = false;

    /**
     * @property Whether or not this is a hidden service
     * @private
     */
    private isHidden: boolean = false;

    /**
     * @property An instance to the service's accessory
     * @private
     */
    private accessory?: Accessory;

    /**
     * @property Array of IDs of the linked services
     * @public
     */
    private linkedServices: number[] = [];

    constructor(ID: number, type: string, isHidden: boolean, isPrimary: boolean, linkedServices: number[]) {
        this.ID = ID;

        this.type = type;

        this.isPrimary = isPrimary;

        this.isHidden = isHidden;

        this.linkedServices = linkedServices;
    }

    /**
     * @method Returns ID of the service
     * @returns {number}
     */
    public getID(): number {
        return this.ID;
    }

    /**
     * @method Returns Characteristics
     */
    public getCharacteristics(): { [index: number]: Characteristic } {
        return this.characteristics;
    }

    /**
     * @method Sets the accessory which is related to the service
     * @param accessory
     */
    public setAccessory(accessory: Accessory) {
        if (this.accessory)
            throw new Error('Accessory is already set.');

        this.accessory = accessory;
    }

    /**
     * @method Returns isPrimary
     * @returns {boolean}
     */
    public getIsPrimary(): boolean {
        return this.isPrimary;
    }


    /**
     * @method Returns linkedServices
     * @returns {number[]}
     */
    public getLinkedServices(): number[] {
        return this.linkedServices;
    }

    /**
     * @method Adds a characteristic to this service
     * @param service
     */
    public addCharacteristic(characteristic: Characteristic) {
        if (this.accessory)
            throw new Error('Accessory is already set.');

        if (Object.keys(this.characteristics).length >= 100)
            throw new Error('Service can not have more than 100 characteristics.');

        let characteristicID = characteristic.getID();

        if (characteristicID < 1 || characteristicID > 999)
            throw new Error('Characteristic ID can not be less than 1 or more than 999.');

        for (let index in this.characteristics) {
            if (this.characteristics[index].getType() == characteristic.getType())
                throw new Error('Characteristic type already exists.');
        }

        if (this.characteristics[characteristicID])
            throw new Error('Characteristic ID already exists.');

        this.characteristics[characteristicID] = characteristic;
        characteristic.setService(this);
    }

    /**
     * @method Adds a group of characteristics to this service
     * @param characteristics
     */
    public addCharacteristics(...characteristics: Characteristic[]) {
        for (let characteristic of characteristics)
            this.addCharacteristic(characteristic);
    }

    /**
     * @method Returns an object which represents this service
     * @returns {{[p: string]: any}}
     */
    public toJSON(): { [index: string]: any } {
        let characteristics: {}[] = [];
        for (let index in this.characteristics)
            characteristics.push(this.characteristics[index].toJSON());

        let object: { [index: string]: any } = {
            type: this.type,
            iid: this.ID,
            characteristics: characteristics
        };

        if (this.isHidden)
            object['hidden'] = true;

        if (this.isPrimary)
            object['primary'] = true;

        if (this.linkedServices.length)
            object['linked'] = this.linkedServices;

        return object;
    }
}
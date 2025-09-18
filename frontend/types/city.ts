export interface VillageProps{
    code:number,
    name:string,
    codename:string,
    division_type:string,
    short_codename:string,
}
export interface DistrictProps{
    code:number,
    name:string,
    codename:string,
    division_type:string,
    short_codename:string,
    wards:VillageProps[]
}
export interface CityProps{
    code:number,
    name:string,
    codename:string,
    division_type:string,
    phone_code:string,
    districts:DistrictProps[]
}
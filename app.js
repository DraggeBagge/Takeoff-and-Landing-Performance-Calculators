/*
API for v1.5 https://flightplandatabase.com/dev/api#endpoint-airport
https://www.taniarascia.com/how-to-connect-to-an-api-with-javascript/
*/

let flaps, ecs;
let inputWeight;
let inputTemp;
let pressure;
let fieldElevation;
let windDegrees;
let windSpeed;
let resultDiv;
let calcButton;
let resetButton;

let inputWeightRef;
let inputTempRef;
let pressureRef;
let fieldElevationRef;
let runwayHeadingRef;
let runwaySlopeRef;
let windDegreesRef;
let windSpeedRef;
let flapRef;
let ecsRef;
let aiRef;
let wrongSetConfRef;
let inputErrRef;

let tempArrey;
let headwind, crosswind;//crosswind not used currently due to no need, here for future reference
let dispV1;
let dispVr;
let dispV2;
let dispVClean;
let dispVFlaps;
let dispPA;
let settingsUsed;
let dispWrongSetConf;
let dispInputErr;

let pressureAltitudeArr= [];
let weightArr= [];

/*
Declaration of all speed arrays 

set1: FLAP0, ECS OFF, A/I Off
set2: Flap0, ECS OFF, A/I on
set3: Flap0, ECS ON, A/I off
set4: Flap15, ECS off, A/I off
set5: Flap15, ECS off, A/I on
set6: Flap15, ECS ON, A/I off
The array is 3 demensional with an additional dimension containing V1, Vr and V3 speeds.
To access the data use
setNumber[X] --> 2 elements: 0 contains PA, 1 contains weight-values
setNumber[X][Y] --> 5 PA:10 weight elements: 0:1 = -1000 :SL PA; 2:4 = 2000:6000 with 2000 PA increments || 0:9 = 20000:29000 LBS with 1000 LBS increments
setNumber[X][Y][Z] --> 11 elements: 0:9 = -40:+50 Celcius with 10 celcius degrees increase for each index || 10:11 = Vclean:Vflap
setNumber[X][Y][Z][W] --> 3 elements: 0:2 = V1, Vr, V2

Six arrays
    Two arreys each, one PA one weight
        inside PA there are 5 arrays (rows) corresponding to the pressure altitude,  each row contains 12 indexes having V1, V2. V3 speeds depending on what outside temperature is except element 11 and 12 which contain vclean and vflap speeds.  
        inside Weight there are 10 arrays (rows) corresponding to aircraft gross weight, each row containing 12 indexes having V1, V2. V3 speeds depending on what outside temperature is except element 11 and 12 which contain vclean and vflap speeds.  
*/

const set1 = [/*here beginns the PA array*/[/*pressure altitude -1000*/[/*-40*/[109,115,121],/*-30*/[108,114,120], /*-20*/[107,113,119],/*-10*/[106,113,118],/*0*/[105,112,117],/*10*/[104,111,116],/*20*/[104,111,116],/*30*/[103,110,115],/*40*/[102,109,114],/*50*/[98,106,109],/*Vclean*/,/*Vflap missing*/]

,/*pressure altitude S.L.*/[/*-40*/[108,114,120],/*-30*/[107,114,119], /*-20*/[106,113,118],/*-10*/[105,112,117],/*0*/[104,111,116],/*10*/[104,111,116],/*20*/[103,110,115],/*30*/[102,109,114],/*40*/[100,107,112],/*50*/[/*v1 null*/,/*v2 null*/,/*v3 null*/],/*Vclean*/,/*Vflap*/]

,/*pressure altitude 2000*/[/*-40*/[106,113,118],/*-30*/[105,112,118], /*-20*/[104,111,116],/*-10*/[104,111,116],/*0*/[103,110,115],/*10*/[102,109,114],/*20*/[101,109,114],/*30*/[99,107,111],/*40*/[/*v1*/,/*v2*/,/*v3*/],/*50*/[/*v1*/,/*v2*/,/*v3*/],/*Vclean*/,/*Vflap*/]

,/*pressure altitude 4000*/[/*-40*/[105,112,117],/*-30*/[104,111,116], /*-20*/[103,110,115],/*-10*/[102,109,114],/*0*/[101,109,114],/*10*/[101,108,112],/*20*/[100,106,111],/*30*/[/*v1*/,/*v2*/,/*v3*/],/*40*/[/*v1*/,/*v2*/,/*v3*/],/*50*/[/*v1*/,/*v2*/,/*v3*/],/*Vclean*/,/*Vflap*/]

,/*pressure altitude 6000*/[/*-40*/[103,110,115],/*-30*/[102,109,114], /*-20*/[101,109,113],/*-10*/[101,108,112],/*0*/[100,108,111],/*10*/[99,106,109],/*20*/[100,106,108],/*30*/[/*v1*/,/*v2*/,/*v3*/],/*40*/[/*v1*/,/*v2*/,/*v3*/],/*50*/[/*v1*/,/*v2*/,/*v3*/],/*Vclean*/,/*Vflap*/]], 

/*------------------------------

here beginns the weight array*/[/*weight 20000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[/*v1*/,/*v2*/,/*v3*/],/*20*/[/*v1*/,/*v2*/,/*v3*/],/*30*/[100,106,108],/*40*/[98,106,108],/*50*/[100,106,108],112,/*Vflap*/]

,/*weight 21000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[102,108,111],/*10*/[102,108,111],/*20*/[102,108,111],/*30*/[102,108,111],/*40*/[102,108,111],/*50*/[103,109,111],115,/*Vflap*/]

,/*weight 22000*/[/*-40*/[104,110,113],/*-30*/[105,110,113], /*-20*/[105,110,113],/*-10*/[104,110,113],/*0*/[104,110,113],/*10*/[104,110,113],/*20*/[104,111,113],/*30*/[104,111,113],/*40*/[105,111,113],/*50*/[107,111,113],118,/*Vflap*/]

,/*weight 23000*/[/*-40*/[107,112,116],/*-30*/[107,112,116], /*-20*/[107,112,116],/*-10*/[107,112,116],/*0*/[107,112,116],/*10*/[107,113,116],/*20*/[108,113,116],/*30*/[107,113,116],/*40*/[108,114,116],/*50*/[110,115,116],120,/*Vflap*/]

,/*weight 24000*/[/*-40*/[110,114,118],/*-30*/[110,114,118], /*-20*/[110,114,118],/*-10*/[110,114,118],/*0*/[110,114,118],/*10*/[110,114,118],/*20*/[111,116,118],/*30*/[111,116,118],/*40*/[111,117,118],/*50*/[113,117,118],122,/*Vflap*/]

,/*weight 25000*/[/*-40*/[112,117,120],/*-30*/[112,118,120], /*-20*/[113,118,120],/*-10*/[113,118,120],/*0*/[114,118,120],/*10*/[114,119,120],/*20*/[114,119,120],/*30*/[114,119,120],/*40*/[115,119,120],/*50*/[117,119,120],125,/*Vflap*/]

,/*weight 26000*/[/*-40*/[115,120,122],/*-30*/[116,120,122], /*-20*/[116,120,122],/*-10*/[116,120,122],/*0*/[116,121,122],/*10*/[116,121,122],/*20*/[117,121,122],/*30*/[117,121,122],/*40*/[118,122,122],/*50*/[120,122,122],127,/*Vflap*/]

,/*weight 27000*/[/*-40*/[118,122,124],/*-30*/[118,122,124], /*-20*/[119,123,124],/*-10*/[119,123,124],/*0*/[119,123,124],/*10*/[120,123,124],/*20*/[120,123,124],/*30*/[120,124,124],/*40*/[120,124,124],/*50*/[123,124,124],129,/*Vflap*/]

,/*weight 28000*/[/*-40*/[121,125,126],/*-30*/[121,125,126], /*-20*/[122,125,126],/*-10*/[122,125,126],/*0*/[122,125,126],/*10*/[123,126,126],/*20*/[123,126,126],/*30*/[122,126,126],/*40*/[124,126,126],/*50*/[126,126,126],131,/*Vflap*/]

,/*weight 29000*/[/*-40*/[125,127,128],/*-30*/[125,127,128], /*-20*/[125,127,128],/*-10*/[125,127,128],/*0*/[125,127,128],/*10*/[125,128,128],/*20*/[126,128,128],/*30*/[126,128,128],/*40*/[127,128,128],/*50*/[128,128,128],133,/*Vflap*/]]];

const set2 = [/*here beginns the PA array*/[/*pressure altitude -1000*/[/*-40*/[109,115,121],/*-30*/[108,114,120], /*-20*/[107,113,119],/*-10*/[106,112,118],/*0*/[106,112,117],/*10*/[105,111,117],/*20*/[104,110,116],/*30*/[102,109,114],/*40*/[98,105,109],/*50*/,/*Vclean*/,/*Vflap missing*/]

,/*pressure altitude S.L.*/[/*-40*/[108,114,120],/*-30*/[107,113,119], /*-20*/[106,112,118],/*-10*/[106,112,117],/*0*/[105,111,116],/*10*/[104,110,115],/*20*/[103,110,114],/*30*/[101,108,112],/*40*/,/*50*/[/*v1 null*/,/*v2 null*/,/*v3 null*/],/*Vclean*/,/*Vflap*/]

,/*pressure altitude 2000*/[/*-40*/[107,113,119],/*-30*/[106,112,118], /*-20*/[105,111,117],/*-10*/[104,110,116],/*0*/[103,110,115],/*10*/[102,109,114],/*20*/[101,108,112],/*30*/,/*40*/[/*v1*/,/*v2*/,/*v3*/],/*50*/[/*v1*/,/*v2*/,/*v3*/],/*Vclean*/,/*Vflap*/]

,/*pressure altitude 4000*/[/*-40*/[105,111,117],/*-30*/[104,110,116], /*-20*/[103,109,114],/*-10*/[102,108,113],/*0*/[100,107,111],/*10*/,/*20*/,/*30*/[/*v1*/,/*v2*/,/*v3*/],/*40*/[/*v1*/,/*v2*/,/*v3*/],/*50*/[/*v1*/,/*v2*/,/*v3*/],/*Vclean*/,/*Vflap*/]

,/*pressure altitude 6000*/[/*-40*/[104,110,115],/*-30*/[103,109,114], /*-20*/[102,108,113],/*-10*/[101,107,112],/*0*/[100,106,110],/*10*/[100,106,108],/*20*/,/*30*/[/*v1*/,/*v2*/,/*v3*/],/*40*/[/*v1*/,/*v2*/,/*v3*/],/*50*/[/*v1*/,/*v2*/,/*v3*/],/*Vclean*/,/*Vflap*/]], 

/*------------------------------

here beginns the weight array*/[/*weight 20000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[/*v1*/,/*v2*/,/*v3*/],/*20*/[100,106,108],/*30*/[99,106,108],/*40*/[102,107,108],/*50*/[102,107,108],127,/*Vflap*/]

,/*weight 21000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[102,107,111],/*10*/[102,108,111],/*20*/[100,108,111],/*30*/[102,108,111],/*40*/[104,109,111],/*50*/[106,109,111],130,/*Vflap*/]

,/*weight 22000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[104,110,113],/*-10*/[104,110,113],/*0*/[104,110,113],/*10*/[104,110,113],/*20*/[103,110,113],/*30*/[105,111,113],/*40*/[107,112,113],/*50*/[109,112,113],133,/*Vflap*/]

,/*weight 23000*/[/*-40*/[107,112,116],/*-30*/[107,112,116], /*-20*/[107,112,116],/*-10*/[107,113,116],/*0*/[107,113,116],/*10*/[107,113,116],/*20*/[106,113,116],/*30*/[108,114,116],/*40*/[111,115,116],/*50*/[113,115,116],135,/*Vflap*/]

,/*weight 24000*/[/*-40*/[109,114,118],/*-30*/[110,114,118], /*-20*/[110,114,118],/*-10*/[110,115,118],/*0*/[110,115,118],/*10*/[111,115,118],/*20*/[110,116,118],/*30*/[112,116,118],/*40*/[114,117,118],/*50*/[116,117,118],137,/*Vflap*/]

,/*weight 25000*/[/*-40*/[112,117,120],/*-30*/[112,118,120], /*-20*/[113,118,120],/*-10*/[113,118,120],/*0*/[114,118,120],/*10*/[114,119,120],/*20*/[114,119,120],/*30*/[114,119,120],/*40*/[115,119,120],/*50*/[117,119,120],125,/*Vflap*/]

,/*weight 26000*/[/*-40*/[115,120,122],/*-30*/[116,120,122], /*-20*/[116,120,122],/*-10*/[116,120,122],/*0*/[116,121,122],/*10*/[116,121,122],/*20*/[117,121,122],/*30*/[117,121,122],/*40*/[118,122,122],/*50*/[120,122,122],127,/*Vflap*/]

,/*weight 27000*/[/*-40*/[118,122,124],/*-30*/[118,122,124], /*-20*/[119,123,124],/*-10*/[119,123,124],/*0*/[119,123,124],/*10*/[120,123,124],/*20*/[120,123,124],/*30*/[120,124,124],/*40*/[120,124,124],/*50*/[123,124,124],129,/*Vflap*/]

,/*weight 28000*/[/*-40*/[121,125,126],/*-30*/[121,125,126], /*-20*/[122,125,126],/*-10*/[122,125,126],/*0*/[122,125,126],/*10*/[123,126,126],/*20*/[123,126,126],/*30*/[122,126,126],/*40*/[124,126,126],/*50*/[126,126,126],131,/*Vflap*/]

,/*weight 29000*/[/*-40*/[125,127,128],/*-30*/[125,127,128], /*-20*/[125,127,128],/*-10*/[125,127,128],/*0*/[125,127,128],/*10*/[125,128,128],/*20*/[126,128,128],/*30*/[126,128,128],/*40*/[127,128,128],/*50*/[128,128,128],133,/*Vflap*/]]];

const set3 = [/*here beginns the PA array*/[/*pressure altitude -1000*/[/*-40*/[110,115,121],/*-30*/[109,114,120], /*-20*/[108,114,119],/*-10*/[107,113,118],/*0*/[106,112,117],/*10*/[105,111,117],/*20*/[104,111,116],/*30*/[103,110,115],/*40*/[101,107,112],/*50*/[96,104,107],/*Vclean*/,/*Vflap*/]

,/*pressure altitude S.L.*/[/*-40*/[109,114,120],/*-30*/[108,114,119], /*-20*/[107,113,118],/*-10*/[106,112,117],/*0*/[105,112,117],/*10*/[104,111,116],/*20*/[104,110,115],/*30*/[102,109,113],/*40*/[98,105,109],/*50*/[94,102,105],/*Vclean*/,/*Vflap*/]

,/*pressure altitude 2000*/[/*-40*/[107,113,119],/*-30*/[106,112,117], /*-20*/[105,112,117],/*-10*/[104,111,116],/*0*/[104,110,115],/*10*/[103,109,114],/*20*/[102,108,113],/*30*/[98,105,109],/*40*/[94,101,104],/*50*/[90,98,100],/*Vclean*/,/*Vflap*/]

,/*pressure altitude 4000*/[/*-40*/[106,112,117],/*-30*/[105,111,116], /*-20*/[104,110,115],/*-10*/[103,109,114],/*0*/[102,108,113],/*10*/[100,107,112],/*20*/[97,105,109],/*30*/[93,101,104],/*40*/[89,98,100],/*50*/[86,94,95],/*Vclean*/,/*Vflap*/]

,/*pressure altitude 6000*/[/*-40*/[104,110,115],/*-30*/[103,109,114], /*-20*/[102,109,113],/*-10*/[101,108,112],/*0*/[99,106,111],/*10*/[97,104,108],/*20*/[93,101,104],/*30*/[89,97,99],/*40*/[86,94,95],/*50*/[82,91,91],/*Vclean*/,/*Vflap*/]], 

/*------------------------------

here beginns the weight array*/[/*weight 20000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[/*v1*/,/*v2*/,/*v3*/],/*20*/[99,105,108],/*30*/[102,106,108],/*40*/[99,107,108],/*50*/[101,108,108],112,/*Vflap*/]

,/*weight 21000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[102,107,111],/*20*/[103,108,111],/*30*/[105,109,111],/*40*/[102,110,111],/*50*/[103,111,111],115,/*Vflap*/]

,/*weight 22000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[104,110,113],/*0*/[105,110,113],/*10*/[105,111,113],/*20*/[106,111,113],/*30*/[105,112,113],/*40*/[106,113,113],/*50*/[108,113,113],118,/*Vflap*/]

,/*weight 23000*/[/*-40*/[107,112,116],/*-30*/[107,112,116], /*-20*/[107,112,116],/*-10*/[108,113,116],/*0*/[108,113,116],/*10*/[108,113,116],/*20*/[107,114,116],/*30*/[108,115,116],/*40*/[109,115,116],/*50*/[112,116,116],120,/*Vflap*/]

,/*weight 24000*/[/*-40*/[110,115,118],/*-30*/[110,115,118], /*-20*/[110,115,118],/*-10*/[111,115,118],/*0*/[111,116,118],/*10*/[112,116,118],/*20*/[110,117,118],/*30*/[111,117,118],/*40*/[112,118,118],/*50*/[115,118,118],122,/*Vflap*/]

,/*weight 25000*/[/*-40*/[113,117,120],/*-30*/[113,118,120], /*-20*/[114,118,120],/*-10*/[114,118,120],/*0*/[114,118,120],/*10*/[115,119,120],/*20*/[116,119,120],/*30*/[114,120,120],/*40*/[116,120,120],/*50*/[120,120,120],125,/*Vflap*/]

,/*weight 26000*/[/*-40*/[116,120,122],/*-30*/[117,120,122], /*-20*/[117,120,122],/*-10*/[117,121,122],/*0*/[118,121,122],/*10*/[1181201122],/*20*/[119,122,122],/*30*/[118,122,122],/*40*/[119,122,122],/*50*/[122,122,122],127,/*Vflap*/]

,/*weight 27000*/[/*-40*/[119,123,124],/*-30*/[120,123,124], /*-20*/[120,123,124],/*-10*/[120,123,124],/*0*/[120,123,124],/*10*/[121,124,124],/*20*/[122,124,124],/*30*/[120,124,124],/*40*/[124,124,124],/*50*/[124,124,124],129,/*Vflap*/]

,/*weight 28000*/[/*-40*/[122,125,126],/*-30*/[123,125,126], /*-20*/[123,126,126],/*-10*/[123,126,126],/*0*/[123,126,126],/*10*/[124,126,126],/*20*/[125,126,126],/*30*/[123,126,126],/*40*/[126,126,126],/*50*/[126,126,126],131,/*Vflap*/]

,/*weight 29000*/[/*-40*/[125,127,128],/*-30*/[125,127,128], /*-20*/[126,128,128],/*-10*/[126,128,128],/*0*/[126,128,128],/*10*/[127,128,128],/*20*/[128,128,128],/*30*/[128,128,128],/*40*/[128,128,128],/*50*/[128,128,128],133,/*Vflap*/]]];

const set4 = [/*here beginns the PA array*/[/*pressure altitude -1000*/[/*-40*/[109,111,115],/*-30*/[108,111,114], /*-20*/[107,110,113],/*-10*/[107,109,112],/*0*/[106,108,112],/*10*/[105,108,111],/*20*/[104,107,110],/*30*/[104,106,109],/*40*/[102,105,108],/*50*/[99,102,104],/*Vclean*/,/*Vflap*/]

,/*pressure altitude S.L.*/[/*-40*/[108,111,114],/*-30*/[108,110,113], /*-20*/[107,109,112],/*-10*/[106,108,112],/*0*/[105,108,111],/*10*/[104,107,110],/*20*/[104,106,109],/*30*/[103,106,108],/*40*/[101,104,106],/*50*/[97,100,102],/*Vclean*/,/*Vflap*/]

,/*pressure altitude 2000*/[/*-40*/[107,109,112],/*-30*/[106,109,112], /*-20*/[105,108,111],/*-10*/[105,107,110],/*0*/[104,106,109],/*10*/[103,106,108],/*20*/[102,105,108],/*30*/[100,103,106],/*40*/[97,100,102],/*50*/[94,97,98],/*Vclean*/,/*Vflap*/]

,/*pressure altitude 4000*/[/*-40*/[105,108,111],/*-30*/[105,107,110], /*-20*/[104,106,109],/*-10*/[103,106,108],/*0*/[102,105,107],/*10*/[101,104,107],/*20*/[100,103,105],/*30*/[97,100,102],/*40*/[93,96,96],/*50*/[/*v1*/,/*v2*/,/*v3*/],/*Vclean*/,/*Vflap*/]

,/*pressure altitude 6000*/[/*-40*/[104,107,109],/*-30*/[103,106,109], /*-20*/[102,105,108],/*-10*/[101,105,107],/*0*/[100,103,106],/*10*/[98,102,104],/*20*/[96,99,101],/*30*/[93,97,99],/*40*/[/*v1*/,/*v2*/,/*v3*/],/*50*/[/*v1*/,/*v2*/,/*v3*/],/*Vclean*/,/*Vflap*/]], 

/*------------------------------

here beginns the weight array*/[/*weight 20000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[/*v1*/,/*v2*/,/*v3*/],/*20*/[/*v1*/,/*v2*/,/*v3*/],/*30*/[/*v1*/,/*v2*/,/*v3*/],/*40*/[94,95,96],/*50*/[94,95,96],108,111]

,/*weight 21000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[/*v1*/,/*v2*/,/*v3*/],/*20*/[/*v1*/,/*v2*/,/*v3*/],/*30*/[95,96,98],/*40*/[95,96,98],/*50*/[95,97,98],111,114]

,/*weight 22000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[/*v1*/,/*v2*/,/*v3*/],/*20*/[/*v1*/,/*v2*/,/*v3*/],/*30*/[98,99,100],/*40*/[98,99,100],/*50*/[98,99,100],113,116]

,/*weight 23000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[/*v1*/,/*v2*/,/*v3*/],/*20*/[100,101,102],/*30*/[100,101,102],/*40*/[97,101,102],/*50*/[99,101,102],115,118]

,/*weight 24000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[101,103,104],/*20*/[102,103,104],/*30*/[99,103,104],/*40*/[101,103,104],/*50*/[102,103,104],118,121]

,/*weight 25000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[103,105,106],/*0*/[103,105,106],/*10*/[103,105,106],/*20*/[104,105,106],/*30*/[104,105,106],/*40*/[103,105,106],/*50*/[105,105,106],120,123]

,/*weight 26000*/[/*-40*/[106,108,108],/*-30*/[106,107,108], /*-20*/[106,106,108],/*-10*/[106,106,108],/*0*/[106,107,108],/*10*/[106,107,108],/*20*/[106,107,108],/*30*/[105,107,108],/*40*/[105,107,108],/*50*/[107,107,108],122,125]

,/*weight 27000*/[/*-40*/[108,108,110],/*-30*/[108,108,110], /*-20*/[108,108,110],/*-10*/[108,108,110],/*0*/[108,108,110],/*10*/[108,108,110],/*20*/[108,109,110],/*30*/[109,109,110],/*40*/[109,109,110],/*50*/[109,109,110],124,127]

,/*weight 28000*/[/*-40*/[110,110,112],/*-30*/[110,110,112], /*-20*/[110,110,112],/*-10*/[110,110,112],/*0*/[110,110,112],/*10*/[110,110,112],/*20*/[111,111,112],/*30*/[111,111,112],/*40*/[111,111,112],/*50*/[111,111,112],126,129]

,/*weight 29000*/[/*-40*/[112,112,114],/*-30*/[112,112,114], /*-20*/[112,112,114],/*-10*/[112,112,114],/*0*/[112,112,114],/*10*/[112,112,114],/*20*/[113,113,114],/*30*/[113,113,114],/*40*/[113,113,114],/*50*/[113,113,114],128,131]]];

const set5 = [/*here beginns the PA array*/[/*pressure altitude -1000*/[/*-40*/[108,111,115],/*-30*/[108,110,114], /*-20*/[107,110,112],/*-10*/[106,109,112],/*0*/[105,108,111],/*10*/[105,107,111],/*20*/[104,107,110],/*30*/[103,106,109],/*40*/[99,102,104],/*50*/[95,98,100],/*Vclean*/,/*Vflap*/]

,/*pressure altitude S.L.*/[/*-40*/[108,110,114],/*-30*/[107,110,113], /*-20*/[106,109,112],/*-10*/[105,108,111],/*0*/[105,108,111],/*10*/[104,107,110],/*20*/[103,106,109],/*30*/[101,104,107],/*40*/[97,100,102],/*50*/[94,96,98],/*Vclean*/,/*Vflap*/]

,/*pressure altitude 2000*/[/*-40*/[106,109,112],/*-30*/[105,108,111], /*-20*/[105,108,111],/*-10*/[104,107,110],/*0*/[103,106,109],/*10*/[102,105,108],/*20*/[101,104,106],/*30*/[97,100,102],/*40*/[94,96,98],/*50*/[/*v1*/,/*v2*/,/*v3*/],/*Vclean*/,/*Vflap*/]

,/*pressure altitude 4000*/[/*-40*/[105,108,111],/*-30*/[104,107,110], /*-20*/[103,106,109],/*-10*/[102,105,108],/*0*/[101,105,108],/*10*/[100,103,106],/*20*/[97,100,102],/*30*/[94,96,98],/*40*/[/*v1*/,/*v2*/,/*v3*/],/*50*/[/*v1*/,/*v2*/,/*v3*/],/*Vclean*/,/*Vflap*/]

,/*pressure altitude 6000*/[/*-40*/[103,106,109],/*-30*/[102,105,108], /*-20*/[101,105,107],/*-10*/[101,104,106],/*0*/[99,102,105],/*10*/[97,100,102],/*20*/[94,97,99],/*30*/[94,95,96],/*40*/[/*v1*/,/*v2*/,/*v3*/],/*50*/[/*v1*/,/*v2*/,/*v3*/],/*Vclean*/,/*Vflap*/]], 

/*------------------------------

here beginns the weight array*/[/*weight 20000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[/*v1*/,/*v2*/,/*v3*/],/*20*/[/*v1*/,/*v2*/,/*v3*/],/*30*/[/*v1*/,/*v2*/,/*v3*/],/*40*/[95,95,96],/*50*/[95,95,96],123,126]

,/*weight 21000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[/*v1*/,/*v2*/,/*v3*/],/*20*/[96,96,98],/*30*/[96,96,98],/*40*/[96,97,98],/*50*/[96,97,98],126,129]

,/*weight 22000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[/*v1*/,/*v2*/,/*v3*/],/*20*/[98,99,100],/*30*/[98,99,100],/*40*/[97,99,100],/*50*/[99,99,100],128,131]

,/*weight 23000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[99,101,102],/*20*/[100,101,102],/*30*/[97,101,102],/*40*/[99,101,102],/*50*/[101,101,102],130,133]

,/*weight 24000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[101,102,104],/*10*/[102,103,104],/*20*/[102,103,104],/*30*/[101,103,104],/*40*/[102,104,104],/*50*/[103,104,104],133,136]

,/*weight 25000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[103,105,106],/*-10*/[104,105,106],/*0*/[104,105,106],/*10*/[104,105,106],/*20*/[104,105,106],/*30*/[104,105,106],/*40*/[105,106,106],/*50*/[105,106,106],135,138]

,/*weight 26000*/[/*-40*/[106,106,108],/*-30*/[106,106,108], /*-20*/[106,106,108],/*-10*/[106,106,108],/*0*/[106,106,108],/*10*/[106,106,108],/*20*/[106,107,108],/*30*/[107,107,108],/*40*/[107,108,108],/*50*/[107,108,108],137,140]

,/*weight 27000*/[/*-40*/[108,108,110],/*-30*/[108,108,110], /*-20*/[108,108,110],/*-10*/[108,108,110],/*0*/[108,108,110],/*10*/[108,108,110],/*20*/[109,109,110],/*30*/[109,109,110],/*40*/[109,110,110],/*50*/[109,110,110],139,142]

,/*weight 28000*/[/*-40*/[110,110,112],/*-30*/[110,110,112], /*-20*/[110,110,112],/*-10*/[110,110,112],/*0*/[110,110,112],/*10*/[110,110,112],/*20*/[111,111,112],/*30*/[111,111,112],/*40*/[111,111,112],/*50*/[111,112,112],141,144]

,/*weight 29000*/[/*-40*/[112,112,114],/*-30*/[112,112,114], /*-20*/[112,112,114],/*-10*/[112,112,114],/*0*/[112,112,114],/*10*/[112,112,114],/*20*/[113,113,114],/*30*/[113,113,114],/*40*/[113,113,114],/*50*/[113,113,114],143,146]]];

//this table is special as it contains more values. Instead of 10 elements it contains 12
const set6 = [/*here beginns the PA array*/[/*pressure altitude -1000*/[/*-40*/[109,111,115],/*-30*/[108,111,114], /*-20*/[107,110,113],/*-10*/[107,109,112],/*0*/[106,108,112],/*10*/[105,108,111],/*20*/[104,107,110],/*30*/[103,106,109],/*40*/[101,104,106],/*50*/[97,100,103],/*Vclean*/,/*Vflap*/]

,/*pressure altitude S.L.*/[/*-40*/[108,111,114],/*-30*/[107,110,113], /*-20*/[107,109,113],/*-10*/[106,108,112],/*0*/[105,108,111],/*10*/[104,107,110],/*20*/[104,106,109],/*30*/[102,105,108],/*40*/[99,102,104],/*50*/[95,98,100],/*Vclean*/,/*Vflap*/]

,/*pressure altitude 2000*/[/*-40*/[107,109,113],/*-30*/[107,109,112], /*-20*/[105,108,111],/*-10*/[104,107,109],/*0*/[104,107,109],/*10*/[103,106,109],/*20*/[102,105,108],/*30*/[98,102,104],/*40*/[94,98,100],/*50*/[91,94,96],/*Vclean*/,/*Vflap*/]

,/*pressure altitude 4000*/[/*-40*/[105,108,111],/*-30*/[105,107,110], /*-20*/[104,106,110],/*-10*/[103,106,109],/*0*/[102,105,108],/*10*/[101,104,106],/*20*/[98,101,104],/*30*/[94,98,100],/*40*/[91,94,96],/*50*/[87,91,93],/*Vclean*/,/*Vflap*/]

,/*pressure altitude 6000*/[/*-40*/[104,107,110],/*-30*/[103,106,109], /*-20*/[102,105,108],/*-10*/[101,104,107],/*0*/[100,103,106],/*10*/[97,101,103],/*20*/[94,97,100],/*30*/[90,94,96],/*40*/[87,92,94],/*50*/[84,88,89],/*Vclean*/,/*Vflap*/]], 

/*------------------------------

here beginns the weight array*/[/*weight 19000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[/*v1*/,/*v2*/,/*v3*/],/*20*/[/*v1*/,/*v2*/,/*v3*/],/*30*/[/*v1*/,/*v2*/,/*v3*/],/*40*/[91,92,94],/*50*/[91,92,94],105,108]

,/*weight 20000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[/*v1*/,/*v2*/,/*v3*/],/*20*/[/*v1*/,/*v2*/,/*v3*/],/*30*/[93,94,96],/*40*/[93,94,96],/*50*/[95,95,96],108,111]

,/*weight 21000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[/*v1*/,/*v2*/,/*v3*/],/*20*/[/*v1*/,/*v2*/,/*v3*/],/*30*/[95,97,98],/*40*/[96,97,98],/*50*/[97,98,98],111,114]

,/*weight 22000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[/*v1*/,/*v2*/,/*v3*/],/*20*/[98,99,100],/*30*/[98,99,100],/*40*/[99,99,100],/*50*/[97,99,100],113,116]

,/*weight 23000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[99,101,102],/*20*/[99,101,102],/*30*/[101,101,102],/*40*/[99,101,102],/*50*/[102,101,102],115,118]

,/*weight 24000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[/*v1*/,/*v2*/,/*v3*/],/*-10*/[/*v1*/,/*v2*/,/*v3*/],/*0*/[/*v1*/,/*v2*/,/*v3*/],/*10*/[101,103,104],/*20*/[102,103,104],/*30*/[103,103,104],/*40*/[101,104,104],/*50*/[104,104,104],118,121]

,/*weight 25000*/[/*-40*/[/*v1*/,/*v2*/,/*v3*/],/*-30*/[/*v1*/,/*v2*/,/*v3*/], /*-20*/[104,105,106],/*-10*/[104,104,106],/*0*/[103,105,106],/*10*/[103,105,106],/*20*/[104,105,106],/*30*/[103,106,106],/*40*/[106,106,106],/*50*/[103,106,106],120,123]

,/*weight 26000*/[/*-40*/[106,107,108],/*-30*/[106,106,108], /*-20*/[106,106,108],/*-10*/[105,106,108],/*0*/[105,106,108],/*10*/[106,107,108],/*20*/[107,107,108],/*30*/[105,108,108],/*40*/[108,108,108],/*50*/[108,108,108],122,125]

,/*weight 27000*/[/*-40*/[108,108,110],/*-30*/[107,108,110], /*-20*/[108,108,110],/*-10*/[108,108,110],/*0*/[108,108,110],/*10*/[109,109,110],/*20*/[109,109,110],/*30*/[110,110,110],/*40*/[110,110,110],/*50*/[110,110,110],124,127]

,/*weight 28000*/[/*-40*/[110,110,112],/*-30*/[110,110,112], /*-20*/[110,110,112],/*-10*/[110,110,112],/*0*/[111,111,112],/*10*/[111,111,112],/*20*/[111,111,112],/*30*/[112,112,112],/*40*/[112,112,112],/*50*/[112,112,112],126,129]

,/*weight 29000*/[/*-40*/[112,112,114],/*-30*/[112,112,114], /*-20*/[112,112,114],/*-10*/[113,113,114],/*0*/[113,113,114],/*10*/[113,113,114],/*20*/[113,113,114],/*30*/[114,114,114],/*40*/[114,114,114],/*50*/[114,114,114],128,131]

,/*weight 30000*/[/*-40*/[114,114,115],/*-30*/[114,114,115], /*-20*/[114,114,115],/*-10*/[114,115,115],/*0*/[115,115,115],/*10*/[115,115,115],/*20*/[115,115,115],/*30*/[115,115,115],/*40*/[115,115,115],/*50*/[115,115,115],129,132]]];




function init () {
   resultDiv = document.getElementById("result");
   calcButton = document.getElementById("calculate");
   resetButton = document.getElementById("reset");
   calcButton.addEventListener('click', calc);
   resetButton.addEventListener('click', reset);
   dispInputErr = document.getElementById('badInput');
   dispWrongSetConf = document.getElementById("badConf");
   dispV1 = document.getElementById("v1");
   dispVr = document.getElementById("vr");
   dispV2 = document.getElementById("v2");
   dispVClean = document.getElementById("vClean");
   dispVFlaps = document.getElementById("vFlap");
   dispPA = document.getElementById("presAlt");

   inputWeightRef = document.getElementById("grossWeight");
   inputTempRef = document.getElementById("temperature");
   pressureRef = document.getElementById("pressure");
   fieldElevationRef = document.getElementById("fieldElevation");
   runwayHeadingRef = document.getElementById("rwHeading");
   runwaySlopeRef = document.getElementById("rwSlope");
   windHeadingRef = document.getElementById("windDegrees");
   windSpeedRef = document.getElementById("windSpeed");
   flapRef = document.getElementsByName("flaps");//if button 15 chosen set true otherwise false.
   ecsRef = document.getElementsByName("ecs");//if on button set true otherwise false
   aiRef = document.getElementsByName("ai");
}

window.addEventListener('load', init);

function calc () {

    resultDiv.style.display="inline";
    resultDiv.style.position = "relative";
    resultDiv.style.left = "40%";
    resultDiv.style.right = "40%";


    inputWeight = Math.ceil(inputWeightRef.value/1000)*1000;
    console.log('Rounded weight: '+ inputWeight);
    inputTemp = Math.round(inputTempRef.value/10)*10;
    pressure = pressureRef.value;
    fieldElevation = fieldElevationRef.value;
    runwayHeading = runwayHeadingRef.value;
    runwaySlope = runwaySlopeRef.value;
    windHeading = windHeadingRef.value;
    windSpeed = windSpeedRef.value;

    console.log(flapRef[1].checked);
    console.log(ecsRef[1].checked);
    console.log(aiRef[1].checked);
    
    limits(inputWeight, inputTemp, pressure, fieldElevation, runwayHeading, runwaySlope, windHeading, windSpeed);
    //chose which set based on flap and ecs choices
    if (flapRef[1].checked == false && ecsRef[1].checked == false && aiRef[1].checked == false){
        settingsUsed = set1;
        console.log("Set1 used");
    }
    else if (flapRef[1].checked == false && ecsRef[1].checked == false && aiRef[1].checked == true){
        settingsUsed = set2;
        console.log("Set2 used");
    }
    else if (flapRef[1].checked == false && ecsRef[1].checked == true && aiRef[1].checked == false){
        settingsUsed = set3;
        console.log("Set3 used");
    }
    else if (flapRef[1].checked == true && ecsRef[1].checked == false && aiRef[1].checked == false){
        settingsUsed = set4;
        console.log("Set4 used");
    }
    else if (flapRef[1].checked == true && ecsRef[1].checked == false && aiRef[1].checked == true){
        settingsUsed = set5;
        console.log("Set5 used");
    }
    else if (flapRef[1].checked == true && ecsRef[1].checked == true && aiRef[1].checked == false){
        settingsUsed = set6;
        console.log("Set6 used");
    }
    else{
        dispWrongSetConf.innerText =  'The config setting of Flap/ECS/Anti-ice is wrongly set.';
    }
    
    //find the right array values
    calculatedPA= paCalc(pressure, fieldElevation);
    getSpeeds(calculatedPA, inputWeight, inputTemp, settingsUsed);//last arg is what set (1-6) is being used
    tempArrey = crossCheck(pressureAltitudeArr, weightArr);
    let [v1, vr, v2, vClean, vFlap] = [tempArrey[0], tempArrey[1], tempArrey[2], tempArrey[3], tempArrey[4]];//values extracted

    //manipulate the extracted values
    headwind = windCompCalc(runwayHeading, windHeading, windSpeed);
    let slopeCorr = slopeCorrection(v1, vr, v2, runwaySlope);//slope needs to be corrected first due to wind changes possibly affecting the v1 and vr minima
    v1 = slopeCorr[0];
    vr = slopeCorr[1];
    let speedCorr = speedsCorrected(v1, vr, v2, headwind); //returns new v1 and vr values
    v1 = speedCorr[0];
    vr = speedCorr[1];

    //display values
    dispV1.innerText = v1;
    dispVr.innerText =  vr;
    dispV2.innerText =  v2;
    dispVClean.innerText = vClean;

    if (typeof vFlap == 'undefined'){
        dispVFlaps.innerText = 'Flaps not used';
    }
    else{
        dispVFlaps.innerText =  vFlap;
    }
    dispPA.innerText =  calculatedPA;
}

function reset () {
    resultDiv.style.display="none";
    inputWeightRef.value = null;
    inputTempRef.value=null;
    fieldElevationRef.value = null;
    runwayHeadingRef.value = null;
    runwaySlopeRef.value = null;
    windHeadingRef.value = null;
    windSpeedRef.value = null;
    flapRef[0].checked = true;
    ecsRef[0].checked = true;
    aiRef[0].checked = true;
}

function getSpeeds(pa, weight, temp, setArr){
    /*Get speed searches for the column based on temperature and alerts the v1 value, vspeed and vflap*/
    var roundPA=Math.round(pa/1000)*1000;//round the value to nearest thousend
    var sendBackPA_V1;
    var sendBackWeight_V1;
    //PA value rows START
    if (roundPA== -1000){
        var loopTemp= -40;
        var loopIndex=0;
        let bool=true;
        while(bool){
            if(temp==loopTemp){
                pressureAltitudeArr.push(setArr[0][0][loopIndex], setArr[0][0][10], setArr[0][0][11]);
                bool=false;
            }
            loopIndex++;
            loopTemp+=10;
        }
    }
    else if (roundPA== 0){
        var loopTemp= -40;
        var loopIndex=0;
        let bool=true;
        while(bool){
            if(temp==loopTemp){
                pressureAltitudeArr.push(setArr[0][1][loopIndex], setArr[0][1][10], setArr[0][1][11]);
                bool=false;
            }
            loopIndex++;
            loopTemp+=10;
        }
    }
    else if (roundPA== 2000){
        var loopTemp= -40;
        var loopIndex=0;
        let bool=true;
        while(bool){
            if(temp==loopTemp){
                pressureAltitudeArr.push(setArr[0][2][loopIndex], setArr[0][2][10], setArr[0][2][11]);
                bool=false;
            }
            loopIndex++;
            loopTemp+=10;
        }
    }
    else if (roundPA== 4000){
        var loopTemp= -40;
        var loopIndex=0;
        let bool=true;
        while(bool){
            if(temp==loopTemp){
                pressureAltitudeArr.push(setArr[0][3][loopIndex], setArr[0][3][10], setArr[0][3][11]);
                bool=false;
            }
            loopIndex++;
            loopTemp+=10;
        }
    }
    else if (roundPA== 6000){
        var loopTemp= -40;
        var loopIndex=0;
        let bool=true;
        while(bool){
            if(temp==loopTemp){
                pressureAltitudeArr.push(setArr[0][4][loopIndex], setArr[0][4][10], setArr[0][4][11]);
                bool=false;
            }
            loopIndex++;
            loopTemp+=10;
        }
    }
    else{
        alert(undefined);
    }
    //PA Value rows end
/*-----------------
-------------------
-------------------*/
    //weight value rows start
    //weightIndex = ceil((input_weight - 20000) / 1000.0);
    let loopWeight=0;
    switch(setArr[1].length){
        case 12:
            for(var weightIndex = 19000; weightIndex<=30000; weightIndex+=1000){
            /*the function iterates over the 10 array elements of possible weights and returns the row of the weight array that 
            contains the vSpeeds*/
                if (weight== weightIndex){
                    var loopTemp= -40;
                    var speedIndex=0;
                    let bool=true;
                    while(bool){
                        if(temp==loopTemp){
                            if(typeof setArr[1][loopWeight]!='undefined' && typeof setArr[1][loopWeight][speedIndex] != 'undefined'){
                                weightArr.push(setArr[1][loopWeight][speedIndex], setArr[1][loopWeight][10], setArr[1][loopWeight][11]);
                                //weightArr will then be [[v1,vr,v2], vClean, vFlap]
                                bool=false;
                            }break; 
                        }
                        speedIndex++;
                        loopTemp+=10;
                    }
                    }loopWeight++; 
                }
            //weight end   
            
            break;
        
        default:
            for(var weightIndex = 20000; weightIndex<=29000; weightIndex+=1000){
            /*the function iterates over the 10 array elements of possible weights and returns the row of the weight array that 
            contains the vSpeeds*/
                if (weight== weightIndex){
                    var loopTemp= -40;
                    var speedIndex=0;
                    let bool=true;
                    while(bool){
                        if(temp==loopTemp){
                            if(typeof setArr[1][loopWeight]!='undefined' && typeof setArr[1][loopWeight][speedIndex] != 'undefined'){
                                weightArr.push(setArr[1][loopWeight][speedIndex], setArr[1][loopWeight][10], setArr[1][loopWeight][11]);
                                //weightArr will then be [[v1,vr,v2], vClean, vFlap]
                                bool=false;
                            }break; 
                        }
                        speedIndex++;
                        loopTemp+=10;
                    }
                    }loopWeight++; 
                }
            //weight end   
            break;//end default case
    }
}


function crossCheck(pressureAltitudeArr, weightArr) {
/*The function takes in V1 from both Pressure Altitude and weight arreyes and compares the values within each arrey. The array with the biggest number gets returned*/
    var valueReturned=[];
    if(pressureAltitudeArr[0][0] >= weightArr[0][0] || typeof weightArr[0][0]=='undefined'){
        //add all speeds together in form of a the returned array, valueReturned

        if (typeof weightArr[2]=='undefined'){
            valueReturned.push(pressureAltitudeArr[0][0], pressureAltitudeArr[0][1], pressureAltitudeArr[0][2], weightArr[1]);
        }
        else{
            valueReturned.push(pressureAltitudeArr[0][0], pressureAltitudeArr[0][1], pressureAltitudeArr[0][2], weightArr[1], weightArr[2]);
        }
        return valueReturned;
      }
    else if(null === weightArr[0][0]){//in the case weight arrey is empty return pressure altitude arrey v-speeds. 
    //it should logically be the same as if above, however this line was needed.
        valueReturned.push(weightArr[1], weightArr[2]);
    return pressureAltitudeArr;
    }
    else{
        valueReturned.push(weightArr[0][0], weightArr[0][1], weightArr[0][2], weightArr[1], weightArr[2]);
        return valueReturned;
      }
    }

function windCalc(runwayHeading, windDirection, windSpeed){
    /*The function takes in runway heading, wind heading and windspeed and returns the wind component vectors (first vector is crosswind and second is headwind) in KNOTS of speed*/
    runwayHeading = runwayHeading * 10;//as the runway that will be entered by user will be a two digit number eg 17
    let degreeDiff = runwayHeading-windDirection;
    let radianDiff = (degreeDiff * Math.PI)/180;
    let windArr=[];//Array containing crosswind speed vector and headwind speed vector
    let crosswind = windSpeed*Math.sin(radianDiff);
    let headwind = windSpeed*Math.cos(radianDiff);
    
    windArr.push(Math.round(crosswind*1)/1, Math.round(headwind*1)/1);
    
    return windArr;
}
function paCalc(pressure, fieldElevation){
    //calculates pressure altitude and returns it as its highest value
    let pa = (29.92 - pressure)*1000 + fieldElevation;
    pa = Math.round(pa*1000)/1000;
    return pa;
}
function windCompCalc(runwayHeading, windHeading, windSpeed){
    runwayHeading = runwayHeading/10;
    let windComponents = windCalc(runwayHeading, windHeading, windSpeed);
    if (windComponents[1] > 0){
        headwind = windComponents[1];
    }
    else{
        headwind = 0;//this is due to us only wanting to use headwind, we do not take tailwind into consideration as per aircraft documentation
    }
    return headwind;
}

function speedsCorrected(v1, vr, v2, headwind){
    //as long as v1 < vr && vr < v2 add 1 knot airspeed to the resulting speeds per 15kts headwind, if its above set the superior number speeds to the variable.
if(headwind >= 15){
    v1 += Math.floor(headwind/15);
    vr += Math.floor(headwind/15);
    if (vr>v2){
        vr = v2;
    }
    if (v1>vr){
        v1 = vr;
    }
}
return [v1, vr];
}

function slopeCorrection(v1, vr, v2,  runwaySlope){
    let v1Past = v1;
    let vrPast = vr;
    if (runwaySlope >= 1){
        runwaySlope = Math.floor(runwaySlope);
        v1 += 2 * runwaySlope;
        vr += 0.5 * runwaySlope;
        if (vr>v2){
            vr = v2;
        }
        if (v1>vr){
            v1 = vr;
        }
    }
    
    else if (runwaySlope <= -1){
        runwaySlope = Math.ceil(runwaySlope);
        v1 += 2.5 * runwaySlope;
        vr += 1.5 * runwaySlope;
        console.log('v1 past: '+v1Past);
        console.log('rotate past: '+vrPast);
        console.log('v1 after '+v1);
        console.log('Rotate after'+vr);
    }
        //making sure the value never drops below the minimum values.
    if (v1Past > v1){
        v1 = v1Past;
    }
    if (vrPast > vr){
        vr = vrPast;
    }

    return [v1, vr];
}
function limits(weight, temperature, pressure, elevation, runwayHeading, runwaySlope, windDegrees, windspeed){
    let retString = '';
    //the function checks the input ranges and returns ether error messages or the checked values
    if (weight > 30000 || weight < 19000){
        retString += 'Weight Error: Weight outside parametars. If weight below 19.000 lbs, set the value to 19.000 min |';
    }
    if (temperature > 50 || temperature < -40){
        retString += '| Temperature Error: Temperature out of range, takeoff not possible |';
    }
    if (pressure > 35.00|| pressure < 25.00){
        retString += '| Airfield Pressure error: Pressure outside allowed parametars |';
    }
    if (elevation < -100){
        retString += '| Elevation error: Airport elevation outside parametars |';
    }
    if (runwayHeading > 360 || runwayHeading < 1){
        retString += '| Heading Error: Write runway heading between 1 and 360 degrees |';
    }
    if (runwaySlope > 5){
        retString += '| Slope error: I would seriously question departing/landing there mate. If you want to calculate some reference values use 5 degrees and below. |';
    }
    if (windDegrees > 360 || windDegrees < 1){
        retString += '| Wind Degree Error: Write wind between 1 and 360 degrees |';
    }
    if (windspeed > 50 || windspeed < 0){
        retString += '| Windspeed Error: Windspeed out of range --> Do not fly';
    }
    
    if(retString != ''){
        alert(retString);
    }
}
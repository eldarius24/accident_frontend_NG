import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TextFieldP from '../composants/textFieldP';
import './formulaire.css';
import ControlLabelP from '../composants/controlLabelP';
import { Box } from '@mui/material';


export default function AdminPanelSettings({ accidentData }) {
    const { setValue, watch } = useForm();


    const [nameLogin, setnameLogin] = useState(watch('nameLogin') ? watch('nameLogin') : (accidentData && accidentData.nameLogin ? accidentData.nameLogin : null));
    const [adminPanelSettingsmdp, setadminPanelSettingsmdp] = useState(watch('adminPanelSettingsmdp') ? watch('adminPanelSettingsmdp') : (accidentData && accidentData.adminPanelSettingsmdp ? accidentData.adminPanelSettingsmdp : null));


    const [boolCortil, setboolCortil] = useState(watch('boolCortil') ? watch('boolCortil') : (accidentData && accidentData.boolCortil ? accidentData.boolCortil : false));
    const [boolCortibat, setboolCortibat] = useState(watch('boolCortibat') ? watch('boolCortibat') : (accidentData && accidentData.boolCortibat ? accidentData.boolCortibat : false));
    const [boolCortibel, setboolCortibel] = useState(watch('boolCortibel') ? watch('boolCortibel') : (accidentData && accidentData.boolCortibel ? accidentData.boolCortibel : false));
    const [boolNns, setboolNns] = useState(watch('boolNns') ? watch('boolNns') : (accidentData && accidentData.boolNns ? accidentData.boolNns : false));
    const [boolHmns, setboolHmns] = useState(watch('boolHmns') ? watch('boolHmns') : (accidentData && accidentData.boolHmns ? accidentData.boolHmns : false));
    const [boolCortidess, setboolCortidess] = useState(watch('boolCortidess') ? watch('boolCortidess') : (accidentData && accidentData.boolCortidess ? accidentData.boolCortidess : false));
    const [boolAvs, setboolAvs] = useState(watch('boolAvs') ? watch('boolAvs') : (accidentData && accidentData.boolAvs ? accidentData.boolAvs : false));
    const [boolCortitreize, setboolCortitreize] = useState(watch('boolCortitreize') ? watch('boolCortitreize') : (accidentData && accidentData.boolCortitreize ? accidentData.boolCortitreize : false));
    const [boolBipExpresse, setboolBipExpresse] = useState(watch('boolBipExpresse') ? watch('boolBipExpresse') : (accidentData && accidentData.boolBipExpresse ? accidentData.boolBipExpresse : false));
    const [boolNCJ, setboolNCJ] = useState(watch('boolNCJ') ? watch('boolNCJ') : (accidentData && accidentData.boolNCJ ? accidentData.boolNCJ : false));
    const [booladministrateur, setbooladministrateur] = useState(watch('booladministrateur') ? watch('booladministrateur') : (accidentData && accidentData.booladministrateur ? accidentData.booladministrateur : false));
    const [boolCortilr, setboolCortilr] = useState(watch('boolCortilr') ? watch('boolCortilr') : (accidentData && accidentData.boolCortilr ? accidentData.boolCortilr : false));
    const [boolCortibatr, setboolCortibatr] = useState(watch('boolCortibatr') ? watch('boolCortibatr') : (accidentData && accidentData.boolCortibatr ? accidentData.boolCortibatr : false));
    const [boolCortibelr, setboolCortibelr] = useState(watch('boolCortibelr') ? watch('boolCortibelr') : (accidentData && accidentData.boolCortibelr ? accidentData.boolCortibelr : false));
    const [boolNnsr, setboolNnsr] = useState(watch('boolNnsr') ? watch('boolNnsr') : (accidentData && accidentData.boolNnsr ? accidentData.boolNnsr : false));
    const [boolHmnsr, setboolHmnsr] = useState(watch('boolHmnsr') ? watch('boolHmnsr') : (accidentData && accidentData.boolHmnsr ? accidentData.boolHmnsr : false));
    const [boolCortidessr, setboolCortidessr] = useState(watch('boolCortidessr') ? watch('boolCortidessr') : (accidentData && accidentData.boolCortidessr ? accidentData.boolCortidessr : false));
    const [boolAvsr, setboolAvsr] = useState(watch('boolAvsr') ? watch('boolAvsr') : (accidentData && accidentData.boolAvsr ? accidentData.boolAvsr : false));
    const [boolCortitreizer, setboolCortitreizer] = useState(watch('boolCortitreizer') ? watch('boolCortitreizer') : (accidentData && accidentData.boolCortitreizer ? accidentData.boolCortitreizer : false));
    const [boolBipExpresser, setboolBipExpresser] = useState(watch('boolBipExpresser') ? watch('boolBipExpresser') : (accidentData && accidentData.boolBipExpresser ? accidentData.boolBipExpresser : false));
    const [boolNCJr, setboolNCJr] = useState(watch('boolNCJr') ? watch('boolNCJr') : (accidentData && accidentData.boolNCJr ? accidentData.boolNCJr : false));



    useEffect(() => {
        setValue('nameLogin', nameLogin)
        setValue('adminPanelSettingsmdp', adminPanelSettingsmdp)
        setValue('boolCortil', boolCortil)
        setValue('boolCortibat', boolCortibat)
        setValue('boolCortibel', boolCortibel)
        setValue('boolNns', boolNns)
        setValue('boolHmns', boolHmns)
        setValue('boolCortidess', boolCortidess)
        setValue('boolAvs', boolAvs)
        setValue('boolCortitreize', boolCortitreize)
        setValue('boolBipExpresse', boolBipExpresse)
        setValue('boolNCJ', boolNCJ)
        setValue('booladministrateur', booladministrateur)
        setValue('boolCortilr', boolCortilr)
        setValue('boolCortibatr', boolCortibatr)
        setValue('boolCortibelr', boolCortibelr)
        setValue('boolNnsr', boolNnsr)
        setValue('boolHmnsr', boolHmnsr)
        setValue('boolCortidessr', boolCortidessr)
        setValue('boolAvsr', boolAvsr)
        setValue('boolCortitreizer', boolCortitreizer)
        setValue('boolBipExpresser', boolBipExpresser)
        setValue('boolNCJr', boolNCJr)

    }, [nameLogin, adminPanelSettingsmdp, boolCortil, boolCortibat, boolCortibel, boolNns, boolHmns, boolCortidess, boolAvs, boolCortitreize, boolBipExpresse, boolNCJ, booladministrateur, boolCortilr, boolCortibatr, boolCortibelr, boolNnsr, boolHmnsr, boolCortidessr, boolAvsr, boolCortitreizer, boolBipExpresser, boolNCJr]);







    return (
        <div className="frameStyle-style">
            <h3>Administration des droits</h3>

            <h3>Rentrez un nouvelle utilisateur</h3>

            <TextFieldP id='nameLogin' label="Adresse email" onChange={setnameLogin} defaultValue={nameLogin}></TextFieldP>

            <TextFieldP id='adminPanelSettingsmdp' label="Mot de passe" onChange={setadminPanelSettingsmdp} defaultValue={adminPanelSettingsmdp}></TextFieldP>

            <h3>Donnez les accès administration du site:</h3>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>

                <ControlLabelP id="booladministrateur" label="Administrateur du site" onChange={(booladministrateurCoche) => {
                    setbooladministrateur(booladministrateurCoche);
                    setValue('booladministrateur', booladministrateurCoche);
                }} defaultValue={booladministrateur}></ControlLabelP>

            </Box>

            <h3>Donnez les accès conseiller en prévention:</h3>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginLeft: '120px', marginRight: '120px' }}>
                <ControlLabelP id="boolCortil" label="Cortil" onChange={(boolCortilCoche) => {
                    setboolCortil(boolCortilCoche);
                    setValue('boolCortil', boolCortilCoche);
                }} defaultValue={boolCortil}></ControlLabelP>

                <ControlLabelP id="boolCortibat" label="Cortibat" onChange={(boolCortibatCoche) => {
                    setboolCortibat(boolCortibatCoche);
                    setValue('boolCortibat', boolCortibatCoche);
                }} defaultValue={boolCortibat}></ControlLabelP>

                <ControlLabelP id="boolCortibel" label="Cortibel" onChange={(boolCortibelCoche) => {
                    setboolCortibel(boolCortibelCoche);
                    setValue('boolCortibel', boolCortibelCoche);
                }} defaultValue={boolCortibel}></ControlLabelP>

                <ControlLabelP id="boolNns" label="NNS" onChange={(boolNnsCoche) => {
                    setboolNns(boolNnsCoche);
                    setValue('boolNns', boolNnsCoche);
                }} defaultValue={boolNns}></ControlLabelP>

                <ControlLabelP id="boolHmns" label="Hmns" onChange={(boolHmnsCoche) => {
                    setboolHmns(boolHmnsCoche);
                    setValue('boolHmns', boolHmnsCoche);
                }} defaultValue={boolHmns}></ControlLabelP>


            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' , marginLeft: '120px', marginRight: '120px' }}>

                <ControlLabelP id="boolCortidess" label="Cortidess" onChange={(boolCortidessCoche) => {
                    setboolCortidess(boolCortidessCoche);
                    setValue('boolCortidess', boolCortidessCoche);
                }} defaultValue={boolCortidess}></ControlLabelP>

                <ControlLabelP id="boolAvs" label="Avs" onChange={(boolAvsCoche) => {
                    setboolAvs(boolAvsCoche);
                    setValue('boolAvs', boolAvsCoche);
                }} defaultValue={boolAvs}></ControlLabelP>

                <ControlLabelP id="boolCortitreize" label="Cortitreize" onChange={(boolCortitreizeCoche) => {
                    setboolCortitreize(boolCortitreizeCoche);
                    setValue('boolCortitreize', boolCortitreizeCoche);
                }} defaultValue={boolCortitreize}></ControlLabelP>

                <ControlLabelP id="boolBipExpresse" label="Bip Expresse" onChange={(boolBipExpresseCoche) => {
                    setboolBipExpresse(boolBipExpresseCoche);
                    setValue('boolBipExpresse', boolBipExpresseCoche);
                }} defaultValue={boolBipExpresse}></ControlLabelP>

                <ControlLabelP id="boolNCJ" label="NCJ" onChange={(boolNCJCoche) => {
                    setboolNCJ(boolNCJCoche);
                    setValue('boolNCJ', boolNCJCoche);
                }} defaultValue={boolNCJ}></ControlLabelP>

            </Box>

            <h3>Donnez les accès uniquement consulté les ATs:</h3>

            <Box sx={{ display: 'flex', justifyContent: 'center' , marginLeft: '120px', marginRight: '120px' }}>
                <ControlLabelP id="boolCortilr" label="Cortil" onChange={(boolCortilrCoche) => {
                    setboolCortilr(boolCortilrCoche);
                    setValue('boolCortilr', boolCortilrCoche);
                }} defaultValue={boolCortilr}></ControlLabelP>

                <ControlLabelP id="boolCortibatr" label="Cortibat" onChange={(boolCortibatrCoche) => {
                    setboolCortibatr(boolCortibatrCoche);
                    setValue('boolCortibatr', boolCortibatrCoche);
                }} defaultValue={boolCortibatr}></ControlLabelP>

                <ControlLabelP id="boolCortibelr" label="Cortibel" onChange={(boolCortibelrCoche) => {
                    setboolCortibelr(boolCortibelrCoche);
                    setValue('boolCortibelr', boolCortibelrCoche);
                }} defaultValue={boolCortibelr}></ControlLabelP>

                <ControlLabelP id="boolNnsr" label="NNS" onChange={(boolNnsrCoche) => {
                    setboolNnsr(boolNnsrCoche);
                    setValue('boolNnsr', boolNnsrCoche);
                }} defaultValue={boolNnsr}></ControlLabelP>

                <ControlLabelP id="boolHmnsr" label="Hmns" onChange={(boolHmnsrCoche) => {
                    setboolHmnsr(boolHmnsrCoche);
                    setValue('boolHmnsr', boolHmnsrCoche);
                }} defaultValue={boolHmnsr}></ControlLabelP>

                


            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' , marginLeft: '120px', marginRight: '120px' }}>

                <ControlLabelP id="boolCortidessr" label="Cortidess" onChange={(boolCortidessrCoche) => {
                    setboolCortidessr(boolCortidessrCoche);
                    setValue('boolCortidessr', boolCortidessrCoche);
                }} defaultValue={boolCortidess}></ControlLabelP>

                <ControlLabelP id="boolAvsr" label="Avs" onChange={(boolAvsrCoche) => {
                    setboolAvsr(boolAvsrCoche);
                    setValue('boolAvsr', boolAvsrCoche);
                }} defaultValue={boolAvs}></ControlLabelP>

                <ControlLabelP id="boolCortitreizer" label="Cortitreize" onChange={(boolCortitreizerCoche) => {
                    setboolCortitreizer(boolCortitreizerCoche);
                    setValue('boolCortitreizer', boolCortitreizerCoche);
                }} defaultValue={boolCortitreize}></ControlLabelP>

                <ControlLabelP id="boolBipExpresser" label="Bip Expresse" onChange={(boolBipExpresserCoche) => {
                    setboolBipExpresser(boolBipExpresserCoche);
                    setValue('boolBipExpresser', boolBipExpresserCoche);
                }} defaultValue={boolBipExpresse}></ControlLabelP>

                <ControlLabelP id="boolNCJr" label="NCJ" onChange={(boolNCJrCoche) => {
                    setboolNCJr(boolNCJrCoche);
                    setValue('boolNCJr', boolNCJrCoche);
                }} defaultValue={boolNCJ}></ControlLabelP>

            </Box>

        </div>


    );
}
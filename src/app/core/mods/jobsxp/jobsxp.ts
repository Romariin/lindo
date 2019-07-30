import { Mods } from "../mods";
import { Option } from "app/core/service/settings.service";
import { Logger } from "app/core/electron/logger.helper";

export class Jobsxp extends Mods{

    private params: Option.VIP.General;
    private xpRestanteText : HTMLDivElement;

    constructor(wGame: any, params: Option.VIP.General) {
        super(wGame);
        this.params = params;

        if (this.params.jobsxp) {
            let jobsxpbarCssverif = this.wGame.document.getElementById('jobsxpbarCss');
            let xpRestanteIdverif = this.wGame.document.getElementById('xpRestanteId');
            if (jobsxpbarCssverif && jobsxpbarCssverif.parentElement) jobsxpbarCssverif.parentElement.removeChild(jobsxpbarCssverif);
            if (xpRestanteIdverif && xpRestanteIdverif.parentElement) xpRestanteIdverif.parentElement.removeChild(xpRestanteIdverif);
            Logger.info('- enable jobsxp');

            let jobsxpbarCss = document.createElement('style');
            jobsxpbarCss.id = 'jobsxpbarCss';
            jobsxpbarCss.innerHTML = `
            .xpRestanteText {
                opacity = 0.6;
                box-sizing: border-box;
                border: 1.5px #232323 solid;
                border-radius: 3px;
                overflow: hidden;
                background-color: #333;
                font-size: 11px;
                position: absolute;
                color: white;
                width: 150px;
                margin-right: 10px;
                margin-top: 10px;
                text-align: center;
                text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.9);
                right: 10px;
            }`;
            this.wGame.document.getElementsByTagName('head')[0].appendChild(jobsxpbarCss);
            
            setTimeout(() => {
                this.create();
            }, 5000);
            this.updateJob();
        }
    }

    private create(): void{
        // xpRestanteText
        if (this.params.jobsxp) {
            this.xpRestanteText = document.createElement('div');
            this.xpRestanteText.id = 'xpRestanteId';
            this.xpRestanteText.className = 'xpRestanteText';
            this.xpRestanteText.style.visibility = 'visible';
            let jobs = this.wGame.gui.playerData.jobs.list;
            this.xpRestanteText.innerHTML = '';
            for (var id in jobs) {
                if(this.wGame.gui.playerData.jobs.list[id].experience.jobXpNextLevelFloor){
                    this.xpRestanteText.innerHTML += "<br>" + "<div style=\"color:  #2196f3; font-size: 20px\" >"+ this.wGame.gui.playerData.jobs.list[id].info.nameId + ": </div>"+(this.wGame.gui.playerData.jobs.list[id].experience.jobXpNextLevelFloor - this.wGame.gui.playerData.jobs.list[id].experience.jobXP) + " XP manquant " + " <br> " + " avant le niveau " + (this.wGame.gui.playerData.jobs.list[id].experience.jobLevel + 1 + "</br>") + "<br>";
                }
            }
            if (this.xpRestanteText.innerHTML != '')
                this.wGame.foreground.rootElement.appendChild(this.xpRestanteText);
        }
    }
    

    private setFightStart(): void {
        this.on(this.wGame.dofus.connectionManager, 'GameFightStart', (e: any) => {
            try {
                document.getElementById('xpRestanteId').style.visibility = "hidden";
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }
    
    private stopOnFightEnd(): void {
        this.on(this.wGame.dofus.connectionManager, 'GameFightEndMessage', (e: any) => {
            try {
                document.getElementById('xpRestanteId').style.visibility = "visible";
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }

    private stopOnFightStop(): void {
        this.on(this.wGame.dofus.connectionManager, 'GameFightLeaveMessage', (e: any) => {
            try {
                document.getElementById('xpRestanteId').style.visibility = "visible";
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }

    private effacer():void {
        if (this.xpRestanteText && this.xpRestanteText.parentElement){
            this.xpRestanteText.style.visibility = '';
            this.xpRestanteText.innerHTML = '';
            this.xpRestanteText.parentElement.removeChild(this.xpRestanteText);
        }
    }
    private updateJob(): void {
        this.on(this.wGame.gui, 'JobExperienceUpdateMessage', (e: any) => {
            try {
                this.effacer();
                if(e.experiencesUpdate.jobXpNextLevelFloor){
                    this.create();
                }
            } catch (ex) {
                Logger.info(ex);
            }
        });
    }

    public reset() {
        super.reset();
        if (!this.params.jobsxp) {
            let jobsxpbarCss = this.wGame.document.getElementById('jobsxpbarCss');
            if (jobsxpbarCss && jobsxpbarCss.parentElement) jobsxpbarCss.parentElement.removeChild(jobsxpbarCss);
            if (this.xpRestanteText && this.xpRestanteText.parentElement) this.xpRestanteText.parentElement.removeChild(this.xpRestanteText);
        }
    }

}

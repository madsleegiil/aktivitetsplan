import { getParentPathByChildText } from '../utils';
import { AktivitetsType } from '../data/aktivitet-type';
import { AktivitetStatus } from '../data/aktivitet-status';
import { AktivitetTilstand } from '../data/aktivitet-tilstand';

module.exports = {
    validerInnhold(aktivitet) {
        this.api.validerTekst(
            this.elements.txtSideTittel.selector,
            aktivitet.tittel,
            'Aktivitetsvisning: Validerer sidetittel'
        );

        if (aktivitet.type === AktivitetsType.STILLING)
            this.validerStilling(aktivitet);
        else if (aktivitet.type === AktivitetsType.EGENAKTIVITET)
            this.validerEgenaktivitet(aktivitet);
        else if (aktivitet.type === AktivitetsType.MOTE)
            this.validerMote(aktivitet);
        else if (aktivitet.type === AktivitetsType.AVTALE)
            this.validerSokeJobber(aktivitet);
        else if (aktivitet.type === AktivitetsType.MEDISINSKBEHANDLING)
            this.validerMedisinsk(aktivitet);
        else if (aktivitet.type === AktivitetsType.ARENA)
            this.validerArena(aktivitet);
        else
            this.assert.fail(
                `Validering av innhold for ${AktivitetsType[aktivitet.type]
                    .oversiktNavn} er ikke implementert`
            );

        this.validerStatus(aktivitet.kolonne, aktivitet.type);
        return this;
    },

    validerStilling(aktivitet) {
        this.validerDetaljFeltTekst('FRA DATO', aktivitet.fraDatoMedMnd);
        this.validerDetaljFeltTekst('BESKRIVELSE', aktivitet.beskrivelse);
        this.validerDetaljFeltLenke('LENKE', aktivitet.lenke);
        this.validerDetaljFeltTekst('FRIST', aktivitet.tilDatoMedMnd);
        this.validerDetaljFeltTekst('KONTAKTPERSON', aktivitet.kontaktperson);
        this.validerDetaljFeltTekst('ARBEIDSGIVER', aktivitet.arbeidsgiver);
        this.validerDetaljFeltTekst('ARBEIDSSTED', aktivitet.arbeidssted);
        this.validerTilstand(aktivitet.kolonne);
    },

    validerEgenaktivitet(aktivitet) {
        this.validerDetaljFeltTekst('FRA DATO', aktivitet.fraDatoMedMnd);
        this.validerDetaljFeltTekst('BESKRIVELSE', aktivitet.beskrivelse);
        this.validerDetaljFeltLenke('LENKE', aktivitet.lenke);
        this.validerDetaljFeltTekst('TIL DATO', aktivitet.tilDatoMedMnd);
        this.validerDetaljFeltTekst('MÅL MED AKTIVITETEN', aktivitet.hensikt);
        this.validerDetaljFeltTekst('MIN HUSKELISTE', aktivitet.huskeliste);
    },

    validerMote(aktivitet) {
        this.validerDetaljFeltTekst('DATO', aktivitet.fraDatoMedMnd);
        this.validerDetaljFeltTekst('KLOKKESLETT', aktivitet.klokkeslett);
        this.validerDetaljFeltTekst('MØTEFORM', aktivitet.moteform);
        this.validerDetaljFeltTekst('VARIGHET', aktivitet.varighet);
        this.validerDetaljFeltTekst(
            'MØTESTED ELLER ANNEN PRAKTISK INFORMASJON',
            aktivitet.motested
        );
        this.validerDetaljFeltTekst('HENSIKT MED MØTET', aktivitet.hensikt);
        this.validerDetaljFeltTekst(
            'FORBEREDELSER TIL MØTET',
            aktivitet.forberedelser
        );
    },

    validerSokeJobber(aktivitet) {
        this.validerDetaljFeltTekst('FRA DATO', aktivitet.fraDatoMedMnd);
        this.validerDetaljFeltTekst('TIL DATO', aktivitet.tilDatoMedMnd);
        this.validerDetaljFeltTekst(
            'ANTALL SØKNADER I PERIODEN',
            aktivitet.antallSoknader
        );
        this.validerDetaljFeltTekst(
            'OPPFØLGING FRA NAV',
            aktivitet.oppfolgingFraNav
        );
        this.validerDetaljFeltTekst('BESKRIVELSE', aktivitet.beskrivelse);
    },

    validerMedisinsk(aktivitet) {
        this.validerDetaljFeltTekst(
            'TYPE BEHANDLING',
            aktivitet.behandlingsType
        );
        this.validerDetaljFeltTekst(
            'BEHANDLINGSSTED',
            aktivitet.behandlingsSted
        );
        this.validerDetaljFeltTekst('FRA DATO', aktivitet.fraDatoMedMnd);
        this.validerDetaljFeltTekst('TIL DATO', aktivitet.tilDatoMedMnd);
        this.validerDetaljFeltTekst('MÅL FOR BEHANDLINGEN', aktivitet.mal);
        this.validerDetaljFeltTekst(
            'OPPFØLGING FRA NAV',
            aktivitet.oppfolgingFraNav
        );
        this.validerDetaljFeltTekst('BESKRIVELSE', aktivitet.beskrivelse);
    },

    validerArena(aktivitet){
        this.validerDetaljFeltTekst('FRA DATO', aktivitet.fraDatoMedMnd);
        this.validerDetaljFeltTekst('TIL DATO', aktivitet.tilDatoMedMnd);
        this.validerDetaljFeltTekst('ARRANGØR', aktivitet.arrangoer);
        this.validerDetaljFeltTekst('DELTAKELSE', aktivitet.deltakelseProsent);
        this.validerDetaljFeltTekst('ANTALL DAGER PER UKE', aktivitet.antallDagerPerUke);
        this.validerDetaljFeltTekst('BESKRIVELSE', aktivitet.beskrivelse);

    },

    validerDetaljFeltTekst(navn, verdi) {
        const timeout = this.api.globals.test_settings.timeout;
        const melding = 'Aktivitet detaljvisning: ' + navn;
        getParentPathByChildText(
            this.api,
            navn,
            this.elements.detaljFelt.selector,
            this.elements.detaljFeltTittel.selector,
            timeout,
            callback => {
                if (!callback.success && verdi.length !== 0)
                    this.api.assert.fail(navn + ':' + callback.errorText);
                if (verdi.length !== 0) {
                    let detalFeltXpath =
                        callback.value + this.elements.detaljFeltTekst.selector;
                    this.api.validerTekst(detalFeltXpath, verdi, melding);
                }
            }
        );
    },

    validerDetaljFeltLenke(navn, verdi) {
        const timeout = this.api.globals.test_settings.timeout;
        const melding = 'Aktivitet detaljvisning: ' + navn;
        getParentPathByChildText(
            this.api,
            navn,
            this.elements.detaljFelt.selector,
            this.elements.detaljFeltTittel.selector,
            timeout,
            callback => {
                if (!callback.success && verdi.length !== 0)
                    this.api.assert.fail(callback.errorText);

                if (verdi.length !== 0) {
                    let detaljFeltXpath =
                        callback.value + this.elements.detaljFeltLenke.selector;

                    this.api.validerTekst(detaljFeltXpath, verdi, melding);

                    this.api.getAttribute(detaljFeltXpath, 'href', href => {
                        this.api.assert.equal(href.status, 0, melding);
                        this.api.verify.equal(href.value, verdi, melding);
                    });
                }
            }
        );
    },

    validerStatus(status, aktivitetsType) {
        const disabledAtt = 'disabled';
        const forventedeStatuser = this.hentForventetStatus(
            status,
            aktivitetsType
        );
        if(aktivitetsType === AktivitetsType.ARENA){
            this.assert.elementNotPresent(this.section.statusSection.selector);
            return;
        }
        forventedeStatuser.forEach(forventet => {
            const statusRdio = this.section.statusSection.hentStatusSelektor(forventet.status).rdio;
            const msgTekst =
                'Validerer aktivert/deaktivert status: ' +
                AktivitetStatus.properties[forventet.status].value;
            this.waitForElementPresent(
                statusRdio,
                this.api.globals.test_settings.timeout
            );
            this.getAttribute(statusRdio, disabledAtt, callback => {
                this.assert.equal(
                    String(callback.value),
                    forventet.disablet,
                    msgTekst
                );
            });
        });

        return this;
    },

    hentForventetStatus(status, aktivitetType) {
        let forventedeStatuser = [
            { status: AktivitetStatus.FORSLAG, disablet: 'null' },
            { status: AktivitetStatus.PLANLEGGER, disablet: 'null' },
            { status: AktivitetStatus.GJENNOMFORES, disablet: 'null' },
            { status: AktivitetStatus.FULLFORT, disablet: 'null' },
            { status: AktivitetStatus.AVBRUTT, disablet: 'null' },
        ];

        if (
            status === AktivitetStatus.FULLFORT ||
            status === AktivitetStatus.AVBRUTT
        ) {
            forventedeStatuser.forEach(x => (x.disablet = 'true'));
        } else if (aktivitetType === AktivitetsType.MOTE) {
            forventedeStatuser
                .filter(x => x.status === AktivitetStatus.FULLFORT)
                .forEach(y => {
                    y.disablet = 'true';
                });
        }

        return forventedeStatuser;
    },

    validerTilstand(status) {
        const disabledAtt = 'disabled';
        const forventedeTilstander = this.hentForventetTilstand(status);

        forventedeTilstander.forEach(forventet => {
            const tilstandRdio = this.section.tilstandSection.hentTilstandSelektor(forventet.status)
                .rdio;
            const msgTekst =
                'Validerer aktivert/deaktivert status: ' +
                AktivitetTilstand.properties[forventet.status].value;
            this.waitForElementPresent(
                tilstandRdio,
                this.api.globals.test_settings.timeout
            );
            this.getAttribute(tilstandRdio, disabledAtt, callback => {
                this.assert.equal(
                    String(callback.value),
                    forventet.disablet,
                    msgTekst
                );
            });
        });
    },

    hentForventetTilstand(status) {
        let forventedeStatuser = [
            { status: AktivitetTilstand.INGEN, disablet: 'null' },
            { status: AktivitetTilstand.SOKNADSENDT, disablet: 'null' },
            { status: AktivitetTilstand.INNKALT, disablet: 'null' },
            { status: AktivitetTilstand.AVSLAG, disablet: 'null' },
            { status: AktivitetTilstand.JOBBTILBUD, disablet: 'null' },
        ];

        if (
            status === AktivitetStatus.FULLFORT ||
            status === AktivitetStatus.AVBRUTT
        ) {
            forventedeStatuser.forEach(x => (x.disablet = 'true'));
        }

        return forventedeStatuser;
    },

    trykkEndre(nesteSide) {
        let timeout = this.api.globals.test_settings.timeout;
        this.api.waitForElementVisible(
            this.elements.btnEndre.selector,
            timeout
        );
        this.click(this.elements.btnEndre.selector);
        this.waitForElementNotPresent(
            this.elements.side.selector,
            timeout
        ).waitForElementVisible(nesteSide.elements.btnLagre.selector, timeout);

        return nesteSide;
    },

    setStatus(status) {
        let rdioSelector = this.section.statusSection.hentStatusSelektor(status).label;
        const statusSection = this.section.statusSection.elements;
        const btnBekreft = statusSection.btnBekreft.selector;
        const timeout = this.api.globals.test_settings.timeout;

        this.click(rdioSelector).waitForElementVisible(btnBekreft, timeout);

        if (
            status === AktivitetStatus.FULLFORT ||
            status === AktivitetStatus.AVBRUTT
        ) {
            this.assert.visible(statusSection.ikonAlert.selector);
            this.assert.visible(statusSection.txtAlert.selector);
        }

        this.click(btnBekreft);
        this.waitForElementNotPresent(btnBekreft, timeout);
        return this;
    },

    markerAvtaltMedNav() {
        const timeout = this.api.globals.test_settings.timeout;
        this.click(
            this.elements.rdioAvtaltMedNav.selector
        ).waitForElementVisible(
            this.elements.btnBekreftAvtaltMedNav.selector,
            timeout
        );
        this.click(
            this.elements.btnBekreftAvtaltMedNav.selector
        ).waitForElementVisible(
            this.elements.txtAvtaltMedNav.selector,
            timeout
        );
        this.assert.containsText(
            this.elements.txtAvtaltMedNav.selector,
            'Aktiviteten er nå merket "Avtalt med NAV"'
        );
        return this;
    },

    setTilstand(tilstand) {
        let rdioSelector = this.section.tilstandSection.hentTilstandSelektor(tilstand).label;
        let btnBekreft = this.section.tilstandSection.elements.btnBekreft
            .selector;
        let timeout = this.api.globals.test_settings.timeout;

        this.waitForElementVisible(rdioSelector, timeout)
            .click(rdioSelector)
            .waitForElementVisible(btnBekreft, timeout)
            .click(btnBekreft)
            .waitForElementNotPresent(btnBekreft, timeout);

        return this;
    },

    slettAktivitet(nesteside) {
        const timeout = this.api.globals.test_settings.timeout;
        this.waitForElementVisible(this.elements.btnSlett.selector, timeout);
        this.api.pause(500); // slett knapp har en tendens til å bli utdatert(stale).
        this.click(this.elements.btnSlett.selector, callback => {
            if (callback.status !== 0) {
                console.log(callback);
                this.click(this.elements.btnSlett.selector);
            }
        })
            .waitForElementPresent(
                this.elements.wndBekreftSletting.selector,
                timeout
            )
            .click(this.elements.btnBekreftSletting.selector)
            .waitForElementNotPresent(
                this.elements.wndBekreftSletting.selector,
                timeout
            );
        return nesteside;
    },

    leggTilDialog(dialog) {
        this.click(this.elements.btnDialog.selector);
        this.api.page.dialogvisning().leggTilMelding(dialog, false);
        return this;
    },

    lukkVindu(nesteSide) {
        var timeout = this.api.globals.test_settings.timeout;
        this.click(this.elements.btnLukk.selector);
        this.waitForElementVisible(nesteSide.elements.side.selector, timeout);
        return nesteSide;
    },
};

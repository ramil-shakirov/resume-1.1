sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("resume.freestyle.controller.CV", {

        onInit: function () {
            this.getView().setModel(new JSONModel({}), "weather");
            this._loadData();
            this._loadWeather();
        },

        _loadData: function () {
            var oView = this.getView();

            fetch("model/resume.json")
                .then(function (oResp) { return oResp.json(); })
                .then(function (oData) {
                    oView.setModel(new JSONModel(oData), "cv");
                })
                .catch(function (oError) {
                    console.error("Error loading resume data:", oError);
                });
        },

        _loadWeather: function () {
            var oWeatherModel = this.getView().getModel("weather");
            var sUrl = "https://api.openweathermap.org/data/2.5/weather" +
                "?q=Berlin&appid=f82181848cd65c018136b9d83393fd32&units=metric&lang=de";

            fetch(sUrl)
                .then(function (oResp) { return oResp.json(); })
                .then(function (oData) {
                    if (oData && oData.main) {
                        oWeatherModel.setData({
                            temp: Math.round(oData.main.temp),
                            description: oData.weather[0].description,
                            icon: "https://openweathermap.org/img/wn/" + oData.weather[0].icon + ".png",
                            loaded: true
                        });
                    }
                })
                .catch(function () { /* silent fail */ });
        },

        formatDateRange: function (sStart, sEnd) {
            var sFrom = this._formatDate(sStart);
            var sTo = this._formatEndDate(sEnd);
            if (sFrom && sTo) {
                return sFrom + " – " + sTo;
            }
            return sFrom || "";
        },

        _formatDate: function (sDate) {
            if (!sDate) return "";
            // Dates are stored as "yyyy-mm-dd"
            var parts = sDate.split("-");
            if (parts.length === 3 && parts[0] !== "0001" && parts[0] !== "0000") {
                return parts[1] + "/" + parts[0];
            }
            return "";
        },

        _formatEndDate: function (sDate) {
            if (!sDate || sDate === "0001-01-01" || sDate === "0000-00-00" || sDate === "") {
                return "heute";
            }
            return this._formatDate(sDate);
        },

        formatTech: function (sTech) {
            if (!sTech) return "";
            return "Technologien: " + sTech;
        },

        onPrint: function () {
            var oModel = this.getView().getModel("cv");
            if (!oModel) { return; }
            var oData = oModel.getData();

            var oWeatherModel = this.getView().getModel("weather");
            var oWeather = oWeatherModel && oWeatherModel.getData();

            var fnDate = this._formatDate.bind(this);
            var fnEndDate = this._formatEndDate.bind(this);

            // Build experience rows
            var sExp = (oData._Experiences || []).map(function (e) {
                var sTech = e.Technologies ? "<div style='font-size:11px;color:#666;margin-top:4px'>Technologien: " + e.Technologies + "</div>" : "";
                return "<div style='display:flex;margin-bottom:18px;page-break-inside:avoid'>" +
                    "<div style='min-width:150px;font-size:12px;color:#555;padding-right:16px;padding-top:2px'>" +
                        fnDate(e.StartDate) + " – " + fnEndDate(e.EndDate) +
                        "<div style='font-size:11px;color:#888;margin-top:4px'>" + (e.Location || "") + "</div>" +
                    "</div>" +
                    "<div style='flex:1'>" +
                        "<div style='font-weight:700;font-size:13.5px;color:#1a1a1a'>" + (e.CompanyName || "") + "</div>" +
                        "<div style='font-style:italic;font-size:12.5px;color:#444;margin:3px 0 8px'>" + (e.RoleTitle || "") + "</div>" +
                        "<div style='font-size:12.5px;color:#333;line-height:1.55'>" + (e.Tasks || "") + "</div>" +
                        sTech +
                    "</div>" +
                "</div>";
            }).join("");

            // Build education rows
            var sEdu = (oData._Educations || []).map(function (e) {
                var sDesc = e.Description ? "<div style='font-size:12px;color:#555;margin-top:6px'>" + e.Description + "</div>" : "";
                var sEduTech = e.Technologies ? "<div style='font-size:11px;color:#666;margin-top:4px'>Technologien: " + e.Technologies + "</div>" : "";
                return "<div style='display:flex;margin-bottom:18px;page-break-inside:avoid'>" +
                    "<div style='min-width:150px;font-size:12px;color:#555;padding-right:16px;padding-top:2px'>" +
                        fnDate(e.StartDate) + " – " + fnEndDate(e.EndDate) +
                        (e.Location ? "<div style='font-size:11px;color:#888;margin-top:4px'>" + e.Location + "</div>" : "") +
                        (e.Grade ? "<div style='font-size:11px;color:#888;margin-top:4px'>" + e.Grade + "</div>" : "") +
                    "</div>" +
                    "<div style='flex:1'>" +
                        "<div style='font-weight:700;font-size:13.5px;color:#1a1a1a'>" + (e.Institution || "") + "</div>" +
                        (e.Degree ? "<div style='font-style:italic;font-size:12.5px;color:#444;margin:3px 0 0'>" + e.Degree + "</div>" : "") +
                        (e.FieldStudy ? "<div style='font-size:12px;color:#666;margin-bottom:6px'>" + e.FieldStudy + "</div>" : "") +
                        sDesc +
                        sEduTech +
                    "</div>" +
                "</div>";
            }).join("");

            // page-break-after/break-after keep a section title from being stranded
            // alone at the bottom of a page, separated from its own content.
            var sSection = "border-bottom:1.5px solid #ccc;padding-bottom:5px;margin-bottom:14px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#1a1a1a;page-break-after:avoid;break-after:avoid-page;";

            // Resolve to an absolute URL: a relative src written into a popup via
            // document.write() does not reliably resolve against this page's URL,
            // which can leave the image stuck loading and freeze the print dialog.
            var sPhotoUrl = oData.PhotoUrl ? new URL(oData.PhotoUrl, document.baseURI).href : "";

            var sHtml = "<!DOCTYPE html><html><head><meta charset='UTF-8'>" +
                "<title>" + (oData.FullName || "Resume") + "</title>" +
                "<style>*{box-sizing:border-box;margin:0;padding:0}@page{size:A4;margin:15mm}body{font-family:Arial,sans-serif;background:#fff;padding:32px 48px;color:#1a1a1a;font-size:13px}@media print{body{padding:0}}</style>" +
                "</head><body>" +

                // Header
                "<div style='display:flex;align-items:center;gap:20px;border-bottom:2px solid #1a1a1a;padding-bottom:20px;margin-bottom:24px'>" +
                    (sPhotoUrl ? "<img id='cvPrintPhoto' src='" + sPhotoUrl + "' style='width:90px;height:90px;border-radius:50%;object-fit:cover;flex-shrink:0'/>" : "") +
                    "<div style='flex:1'>" +
                        "<div style='font-size:26px;font-weight:700;margin-bottom:4px'>" + (oData.FullName || "") + "</div>" +
                        "<div style='font-size:14px;color:#555;font-style:italic;margin-bottom:10px;white-space:pre-line'>" + (oData.Title || "") + "</div>" +
                        "<div style='font-size:12.5px;color:#444;display:flex;gap:20px;flex-wrap:wrap'>" +
                            (oData.Email ? "<span>✉ " + oData.Email + "</span>" : "") +
                            (oData.Phone ? "<span>☎ " + oData.Phone + "</span>" : "") +
                        "</div>" +
                        (oWeather && oWeather.loaded ?
                            "<div style='margin-top:10px;font-size:11px;color:#888'>" +
                                "Ich wohne in Berlin, wo gerade" +
                                "<span style='font-size:12.5px;color:#444;margin:0 6px'>" + oWeather.temp + "°C · " + oWeather.description + "</span>" +
                                "(openweathermap.org API)" +
                            "</div>"
                            : "") +
                    "</div>" +
                "</div>" +

                // Summary
                (oData.Summary ? "<div style='margin-bottom:24px'><div style='" + sSection + "'>Kurzprofil</div><div style='font-size:13px;line-height:1.6;color:#333;white-space:pre-line'>" + oData.Summary + "</div></div>" : "") +

                // Experience
                "<div style='margin-bottom:24px'><div style='" + sSection + "'>Berufserfahrung</div>" + sExp + "</div>" +

                // Education
                "<div style='margin-bottom:24px'><div style='" + sSection + "'>Weiterbildung / Schulbildung</div>" + sEdu + "</div>" +

                // Languages
                "<div><div style='" + sSection + "'>Sprachkenntnisse</div>" +
                    "<div style='display:flex;gap:8px;align-items:baseline;margin-bottom:6px'><span style='min-width:120px;font-weight:600'>Russisch</span><span>Muttersprache</span></div>" +
                    "<div style='display:flex;gap:8px;align-items:baseline;margin-bottom:6px'><span style='min-width:120px;font-weight:600'>Deutsch</span><span>verhandlungssicher</span></div>" +
                    "<div style='display:flex;gap:8px;align-items:baseline'><span style='min-width:120px;font-weight:600'>Englisch</span><span>Intermediate</span></div>" +
                "</div>" +

                "</body></html>";

            var oPrintWin = window.open("", "_blank", "width=900,height=700");
            oPrintWin.document.write(sHtml);
            oPrintWin.document.close();
            oPrintWin.focus();
            oPrintWin.onafterprint = function () {
                oPrintWin.close();
            };

            // Wait for the photo to actually finish loading (or fail) before printing —
            // calling print() while it's still pending is what freezes the "Save" button.
            var bPrinted = false;
            var fnPrint = function () {
                if (bPrinted) { return; }
                bPrinted = true;
                oPrintWin.print();
            };
            var oImg = oPrintWin.document.getElementById("cvPrintPhoto");
            if (oImg && !oImg.complete) {
                oImg.addEventListener("load", fnPrint);
                oImg.addEventListener("error", fnPrint);
                setTimeout(fnPrint, 3000); // safety net in case neither event fires
            } else {
                setTimeout(fnPrint, 300);
            }
        }

    });
});

/*
 * (c) Copyright Ascensio System SIA 2010-2019
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

(function(window, undefined)
{
    /**
     * Base class
     * @global
     * @class
     * @name Api
     */

    /**
     * @typedef {Object} ContentControl
     * @property {string} Tag - is a tag assigned to the content control. One and the same tag can be assigned to several content controls so that you can make reference to them in your code.
     * @property {string} Id - is a unique identifier of the content control. It can be used to search for a certain content control and make reference to it in your code.
     * @property {ContentControlLock} Lock - is a value that defines if it is possible to delete and/or edit the content control or not. 0 - only deleting, 1 - no deleting or editing, 2 - only editing, 3 - full access
     * @property {string} InternalId - is internal id of content control. It used for all operation with content controls
     */

    /**
     * @typedef {Object} ContentControlLock
     * Is a value that defines if it is possible to delete and/or edit the content control or not
     *
     * **0** - only deleting
     * **1** - disable deleting or editing
     * **2** - only editing
     * **3** - full access
     * @property {(0 | 1 | 2 | 3)} Lock
     */

    /**
     * @typedef {Object} ContentControlType
     * Is a numeric value that specifies the content control type.

     * @property  {(1 | 2 | 3 | 4)} type **1** - block content control **2** - inline content control **3** - row content control **4** - cell content control
     */

    /**
     * @typedef {Object} ContentControlPropertiesAndContent
     * Is array of properties and contents of content controls.

     * @property  {ContentControlProperties} [ContentControlProperties = {}]
     * @property  {string} Script is must be a script that will be executed to generate the data within the content control.
     * @property  {string} Url its must be a link to a shared file
     */

    /**
     * @typedef {Object} ContentControlProperties
     * @property {string} Id - is a unique identifier of the content control. It can be used to search for a certain content control and make reference to it in your code.
     * @property {string} Tag - is a tag assigned to the content control. One and the same tag can be assigned to several content controls so that you can make reference to them in your code.
     * @property {ContentControlLock} Lock is a value that defines if it is possible to delete and/or edit the content control or not
     * @property {string} Alias Alias
     * @property {string} Appearance Appearance
     * @property {object} Color Color
     * @property {number} Color.R R
     * @property {number} Color.G G
     * @property {number} Color.B B
     * @example
     * {"Id": 100, "Tag": "CC_Tag", "Lock": 3}
     */

    var Api = window["asc_docs_api"];

    /**
     * Open file with fields
     * @memberof Api
     * @typeofeditors ["CDE"]
     * @alias OpenFile
     * @param {Uint8Array} binaryFile
     * File bytes
     * @param {string[]} fields
     * List fields values
     */
    window["asc_docs_api"].prototype["pluginMethod_OpenFile"] = function(binaryFile, fields)
    {
        this.asc_CloseFile();

        this.FontLoader.IsLoadDocumentFonts2 = true;
        this.OpenDocument2(this.DocumentUrl, binaryFile);

        if (fields)
            this.asc_SetBlockChainData(fields);

        this.restrictions = Asc.c_oAscRestrictionType.OnlyForms;
    };
    /**
     * Get all fields as text
     * @memberof Api
     * @typeofeditors ["CDE"]
     * @alias GetFields
     * @returns {string[]}
     */
    window["asc_docs_api"].prototype["pluginMethod_GetFields"] = function()
    {
        return this.asc_GetBlockChainData();
    };
    /**
     * This method inserts a content control that contains data. The data is specified by the js code for Document Builder, or by the link to a shared document.
     * @memberof Api
     * @typeofeditors ["CDE"]
     * @alias InsertAndReplaceContentControls
     * @param {ContentControlPropertiesAndContent[]} arrDocuments is array of properties and contents of content controls.
     * @return {ContentControlProperties[]} return array of created content controls
     * @example
     * // Add new content control
     * var arrDocuments = [{
     *  "Props": {
     *       "Id": 100,
     *       "Tag": "CC_Tag",
     *       "Lock": 3
     *   },
     *   "Script": "var oParagraph = Api.CreateParagraph();oParagraph.AddText('Hello world!');Api.GetDocument().InsertContent([oParagraph]);"
     *}]
     * window.Asc.plugin.executeMethod("InsertAndReplaceContentControls", [arrDocuments]);
     *
     * // Change existed content control
     * var arrDocuments = [{
     *  "Props": {
     *       "InternalId": "2_803"
     *   },
     *   "Script": "var oParagraph = Api.CreateParagraph();oParagraph.AddText('New text');Api.GetDocument().InsertContent([oParagraph]);"
     *}]
     * window.Asc.plugin.executeMethod("InsertAndReplaceContentControls", [arrDocuments]);

     */
    window["asc_docs_api"].prototype["pluginMethod_InsertAndReplaceContentControls"] = function(arrDocuments)
    {
        var _worker = new AscCommonWord.CContentControlPluginWorker(this, arrDocuments);
        return _worker.start();
    };
    /**
     * This method allows to remove several content controls.
     * @memberof Api
     * @typeofeditors ["CDE"]
     * @alias RemoveContentControls
     * @param {ContentControl[]} arrDocuments is a array of InternalId's. example: [{"InternalId": "5_556"}]
     * @return {undefined}
     * @example
     * window.Asc.plugin.executeMethod("RemoveContentControls", [[{"InternalId": "5_556"}]])
     */
    window["asc_docs_api"].prototype["pluginMethod_RemoveContentControls"] = function(arrDocuments)
    {
        var _worker = new AscCommonWord.CContentControlPluginWorker(this, arrDocuments);
        return _worker.delete();
    };
    /**
     * This method allows to get information about all content controls that have been added to the page.
     * @memberof Api
     * @typeofeditors ["CDE"]
     * @alias GetAllContentControls
     * @returns {ContentControl[]}
     * @example
     * window.Asc.plugin.executeMethod("GetAllContentControls");
     */
    window["asc_docs_api"].prototype["pluginMethod_GetAllContentControls"] = function()
    {
        var _blocks = this.WordControl.m_oLogicDocument.GetAllContentControls();
        var _ret = [];
        var _obj = null;
        for (var i = 0; i < _blocks.length; i++)
        {
            _obj = _blocks[i].GetContentControlPr();
            _ret.push({"Tag" : _obj.Tag, "Id" : _obj.Id, "Lock" : _obj.Lock, "InternalId" : _obj.InternalId});
        }
        return _ret;
    };
    /**
     * This method allows to add an empty content control to the document.
     * @memberof Api
     * @typeofeditors ["CDE"]
     * @alias AddContentControl
     * @param {ContentControlType} type is a numeric value that specifies the content control type
     * @param {ContentControlProperties}  [ properties = {} ] is property of content control
     * @returns {ContentControl} return json with "Tag", "Id", "Lock" and "InternalId" values of created content control
     * @example
     * var type = 1;
     * var properties = {"Id": 100, "Tag": "CC_Tag", "Lock": 3};
     * window.Asc.plugin.executeMethod("AddContentControl", [type, properties]);
     */
    window["asc_docs_api"].prototype["pluginMethod_AddContentControl"] = function(type, properties)
    {
        var _content_control_pr;
        if (properties)
        {
            _content_control_pr = new AscCommon.CContentControlPr();
            _content_control_pr.Id = properties["Id"];
            _content_control_pr.Tag = properties["Tag"];
            _content_control_pr.Lock = properties["Lock"];

            _content_control_pr.Alias = properties["Alias"];

            if (undefined !== properties["Appearance"])
                _content_control_pr.Appearance = properties["Appearance"];

            if (undefined !== properties["Color"])
                _content_control_pr.Color = new Asc.asc_CColor(properties["Color"]["R"], properties["Color"]["G"], properties["Color"]["B"]);
        }

        var _obj = this.asc_AddContentControl(type, _content_control_pr);
        if (!_obj)
            return undefined;
        return {"Tag" : _obj.Tag, "Id" : _obj.Id, "Lock" : _obj.Lock, "InternalId" : _obj.InternalId};
    };
    /**
     * This method allows to remove content control, but leave all its contents.
     * @memberof Api
     * @typeofeditors ["CDE"]
     * @alias RemoveContentControl
     * @param {string} InternalId is a InternalId of the content control
     * @returns {Object}
     * @example
     * window.Asc.plugin.executeMethod("RemoveContentControl", ["InternalId"])
     */
    window["asc_docs_api"].prototype["pluginMethod_RemoveContentControl"] = function(InternalId)
    {
        return this.asc_RemoveContentControlWrapper(InternalId);
    };
    /**
     * This method allows to get the identifier of the selected content control (i.e. the content control where the mouse cursor is currently positioned).
     * @memberof Api
     * @typeofeditors ["CDE"]
     * @alias GetCurrentContentControl
     * @returns {string} InternalId of selected content control
     * @example
     * window.Asc.plugin.executeMethod("GetCurrentContentControl");
     */
    window["asc_docs_api"].prototype["pluginMethod_GetCurrentContentControl"] = function()
    {
        return this.asc_GetCurrentContentControl();
    };
    /**
     * Get current content control properties
     * @memberof Api
     * @typeofeditors ["CDE"]
     * @alias GetCurrentContentControlPr
     * @returns {ContentControlProperties}
     * @example
     * window.Asc.plugin.executeMethod("GetCurrentContentControlPr")
     */
    window["asc_docs_api"].prototype["pluginMethod_GetCurrentContentControlPr"] = function()
    {
        return this.asc_GetContentControlProperties();
    };
    /**
     * Select specified content control
     * @memberof Api
     * @typeofeditors ["CDE"]
     * @alias SelectContentControl
     * @param {string} id is a InternalId of the content control
     * @example
     * window.Asc.plugin.executeMethod("SelectContentControl", ["5_665"]);
     */
    window["asc_docs_api"].prototype["pluginMethod_SelectContentControl"] = function(id)
    {
        var oLogicDocument = this.private_GetLogicDocument();
        if (!oLogicDocument)
            return;

        oLogicDocument.SelectContentControl(id);
    };
    /**
     * Move cursor to specified content control
     * @memberof Api
     * @typeofeditors ["CDE"]
     * @alias MoveCursorToContentControl
     * @param {string} id InternalId of content control
     * @param {boolean} [isBegin = false] is a option for changing cursor position in content control. By default, cursor will place in begin of content control
     * @return {undefined}
     * @example
     * window.Asc.plugin.executeMethod("MoveCursorToContentControl", ["2_839", false])
     */
    window["asc_docs_api"].prototype["pluginMethod_MoveCursorToContentControl"] = function(id, isBegin)
    {
        var oLogicDocument = this.private_GetLogicDocument();
        if (!oLogicDocument)
            return;

        oLogicDocument.MoveCursorToContentControl(id, isBegin);
    };
    /**
     * Get selection in document in text format
     * @memberof Api
     * @typeofeditors ["CDE"]
     * @alias GetSelectedText
     */
    window["asc_docs_api"].prototype["pluginMethod_GetSelectedText"] = function()
    {
        var oLogicDocument = this.private_GetLogicDocument();
        if (!oLogicDocument)
            return;

        return oLogicDocument.GetSelectedText(false, {NewLine : true, NewLineParagraph : true});
    };
    /**
     * Remove selection in document
     * @memberof Api
     * @typeofeditors ["CDE"]
     * @alias RemoveSelectedContent
     * @return {undefined}
     * @example
     *  window.Asc.plugin.executeMethod("RemoveSelectedContent")
     */
    window["asc_docs_api"].prototype["pluginMethod_RemoveSelectedContent"] = function()
    {
        var oLogicDocument = this.private_GetLogicDocument();
        if (!oLogicDocument || !oLogicDocument.IsSelectionUse())
            return;

        if (false === oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Remove, null, true, oLogicDocument.IsFormFieldEditing()))
        {
            oLogicDocument.StartAction(AscDFH.historydescription_Document_BackSpaceButton);
            oLogicDocument.Remove(-1, true);
            oLogicDocument.FinalizeAction();
        }
    };
    /**
     * Add comment to document
     * @memberof Api
     * @typeofeditors ["CDE"]
     * @alias AddComment
     * @param {string} sMessage Message
     * @param {string} sAuthorName Author
     */
    window["asc_docs_api"].prototype["pluginMethod_AddComment"] = function(sMessage, sAuthorName)
    {
        var oData = new asc_CCommentDataWord();

        if (sMessage)
            oData.asc_putText(sMessage);

        if (sAuthorName)
            oData.asc_putUserName(sAuthorName);

        this.asc_addComment(oData);
    };
    /**
     * Move cursor to Start
     * @memberof Api
     * @typeofeditors ["CDE"]
     * @alias MoveCursorToStart
     * @param {boolean} isMoveToMainContent
     */
    window["asc_docs_api"].prototype["pluginMethod_MoveCursorToStart"] = function(isMoveToMainContent)
    {
        var oLogicDocument = this.private_GetLogicDocument();
        if (oLogicDocument)
        {
            if (isMoveToMainContent)
                oLogicDocument.MoveCursorToStartOfDocument();
            else
                oLogicDocument.MoveCursorToStartPos(false);
        }
    };
    /**
     * Move cursor to End
     * @memberof Api
     * @typeofeditors ["CDE"]
     * @alias MoveCursorToEnd
     * @param {boolean} isMoveToMainContent
     */
    window["asc_docs_api"].prototype["pluginMethod_MoveCursorToEnd"] = function(isMoveToMainContent)
    {
        var oLogicDocument = this.private_GetLogicDocument();
        if (oLogicDocument)
        {
            if (isMoveToMainContent)
                oLogicDocument.MoveCursorToStartOfDocument();

            oLogicDocument.MoveCursorToEndPos(false);
        }
    };
    /**
     * Find and replace text.
     * @memberof Api
     * @typeofeditors ["CDE"]
     * @alias SearchAndReplace
     * @param {Object} oProperties The properties for find and replace.
     * @param {string} oProperties.searchString Search string.
     * @param {string} oProperties.replaceString Replacement string.
     * @param {boolean} [oProperties.matchCase=true] matchCase option
     */
    window["asc_docs_api"].prototype["pluginMethod_SearchAndReplace"] = function(oProperties)
    {
        var sSearch     = oProperties["searchString"];
        var sReplace    = oProperties["replaceString"];
        var isMatchCase = undefined !== oProperties["matchCase"] ? oProperties.matchCase : true;

        var oSearchEngine = this.WordControl.m_oLogicDocument.Search(sSearch, {MatchCase : isMatchCase});
        if (!oSearchEngine)
            return;

        this.WordControl.m_oLogicDocument.Search_Replace(sReplace, true, null, false);
    };
    /**
     * Get file content in html format
     * @memberof Api
     * @typeofeditors ["CDE"]
     * @alias GetFileHTML
     * @return {string}
     * @example
     * window.Asc.plugin.executeMethod("GetFileHTML")
     */
    window["asc_docs_api"].prototype["pluginMethod_GetFileHTML"] = function()
    {
        return this.ContentToHTML(true);
    };
})(window);

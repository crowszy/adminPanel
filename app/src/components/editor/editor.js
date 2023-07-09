import '../../helpers/iframeLoader.js';
import axios from "axios";
import React, { Component }  from "react";

export default class Editor extends Component {
    constructor() {
        super();
        this.currentPage = 'index.html';


        this.state = {
            pageList: [],
            newPageName: ''
        }
        this.createNewPage = this.createNewPage.bind(this);
    }

    componentDidMount() {
        this.init(this.currentPage);
    }

    init(page) {
        this.iframe = document.querySelector('iframe');
        this.open(page);
        this.loadingPages();
    }

    open(page) {
        this.currentPage = `../${page}?rnd=${Math.random()}`;

        axios
            .get(`../${page}`)
            .then(res => this.parserStrToDOM(res.data))
            .then(this.wrapTextNodes)
            .then(this.serializeDOMToString)
            .then(html => axios.post('./api/saveTempPage.php', {html}))

        this.iframe.load(this.currentPage, () => {
            
        })
    }

    parserStrToDOM(str) {
        const parser = new DOMParser();
        return parser.parseFromString(str, "text/html");

    }

    wrapTextNodes(dom) {
        const body = dom.body;
            let textNodes = [];

            function recursy(element) {
                element.childNodes.forEach(node => {

                    if(node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, '').length > 0) {
                        console.log(node)
                        textNodes.push(node)
                    } else {
                        recursy(node)
                    }
                })
            }

            recursy(body);

            textNodes.forEach(node => {
                const wrapper = dom.createElement('text-editor');
                node.parentNode.replaceChild(wrapper, node);
                wrapper.appendChild(node);
                wrapper.contentEditable = 'true';
            });

            return dom
    }

    serializeDOMToString(dom) {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(dom)
    }

    loadingPages() {
        axios
            .get('./api')
            .then(res => this.setState({pageList: res.data}))

    }

    createNewPage() {
        axios
            .post('./api/createNewPage.php', {'name': this.state.newPageName})
            .then(this.loadingPages())
            .catch(() => alert('Страница уже существует!'))
    }

    deletePage(page) {
        axios
            .post('./api/deletePage.php', {'name': page})
            .then(this.loadingPages())
            .catch(() => alert('Страницы не существует!'))
    }

    render() {
        // const {pageList} = this.state;
        // const pages = pageList.map((page, i) => {
        //     return (
        //         <h2 key={i}>{page}
        //         <a href="#" onClick={() => this.deletePage(page)}>x</a>
        //         </h2>
        //     )
        // })
        return (
            <iframe src={this.currentPage} frameBorder="0"></iframe>
            // <>
            //     <input onChange={(e) => {this.setState({newPageName: e.target.value})}} type="text" />
            //     <button onClick={this.createNewPage}>Создать страницу</button>
            //     {pages}
            // </>
        )
    }
}
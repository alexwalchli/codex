export default function generateTree() {

    let tree = [
        {
            id: '0',
            childIds: ['1'],
            visible: true
        },
        {
            id: '1',
            childIds: [],
            parentId: '0',
            content: '',
            focused: true,
            collapsed: false,
            dataSources: [],
            visible: true,
            widgets: []
        }
    ];

    return {
        past: {},
        present: tree,
        future: {}    
    };
}

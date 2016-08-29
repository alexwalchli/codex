export default (props={}) => ({
    control: {
        backgroundColor: "transparent",
        fontWeight: "normal",
    },

    input: {
        margin: 0,
    },

    "&singleLine": {
        control: {
            display: "inline-block",
            width: "100%",
        },

        highlighter: {
            padding: 0,
            border: "none",
        },

        input: {
            border: "none",
            outline: "none"
        },
    },

    suggestions: {
        backgroundColor: "#DF5A49",
        color: "#FFF",
        item: {
            padding: "5px 15px",

            "&focused": {
                backgroundColor: "#DF786B",
            }
        }
    }
});
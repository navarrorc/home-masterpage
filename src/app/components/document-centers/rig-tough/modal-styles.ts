// modal styles
// see: https://github.com/reactjs/react-modal#styles
export const customStyles = {
    overlay : {
        // position          : 'absolute',
        border            : 'solid 2px red',
        width             : 0,
        height            : 0,
        top               : 0,
        left              : 0,
        right             : 0,
        bottom            : 0,
        backgroundColor   : 'rgba(255, 255, 255, 0.75)',
        zIndex            : 100,       
    },
    content : {    
            top                   : -500,
            left                  : -500,
            right                 : 'auto',
            bottom                : 'auto',
            marginRight           : '-50%',
            transform             : 'translate(25%, -90%)',
            backgroundColor       : 'rgba(220, 220, 220, 0.74902)',
            // padding: 0,
            overflowY             : 'hidden',
            overflowX             : 'hidden',
            border                : 0,
            borderRadius          : 16
            //border:  '1px solid #ccc',
        }
}
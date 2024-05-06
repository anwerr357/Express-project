export const schemaValidator ={
    username:{
        isLength:{
            options:{
                min:5,
                max:32,
            },
            errorMessage: "Username must be at least 5 chars with a max of 32 chars."

        },
    },
    rate:{
        isInt:{
            options: {
                min:0,
                max:3900
            },
            errorMessage: "Rate must be between 0 and 3900!",
        }
    }

}
const model_weights = {
    "coefficient": {
        "Iris-setosa": {
            "sepal_length": -1.07687517,
            "sepal_width": 1.1556016,
            "petal_length": -1.92845268,
            "petal_width": -1.82066355
        },
        "Iris-versicolor": {
            "sepal_length": 0.58982562,
            "sepal_width": -0.36102976,
            "petal_length": -0.36550337,
            "petal_width": -0.82107003
        },
        "Iris-virginica": {
            "sepal_length": 0.48704955,
            "sepal_width": -0.79457184,
            "petal_length": 2.29395605,
            "petal_width": 2.64173358
        }
    },
    "Intercept": {
        "Iris-setosa": -0.21096025,
        "Iris-versicolor": 2.07632093,
        "Iris-virginica": -1.86536068
    }
};

const numberValidator = x => {
    const num = parseFloat(x);
    return !isNaN(num) && isFinite(num) && !Number.isInteger(num) && num > 0 && num <= 100 ? num : false;
};

const validateFlower = (...dimensions) => dimensions.every(numberValidator);

const calculateFlowerClass = (sepalLength, sepalWidth, petalLength, petalWidth) => {
    const species = ["Iris-setosa", "Iris-versicolor", "Iris-virginica"];
    const scores = {};

    species.forEach(speciesName => {
        const { sepal_length, sepal_width, petal_length, petal_width } = model_weights.coefficient[speciesName];
        const intercept = model_weights.Intercept[speciesName];

        scores[speciesName] = (sepal_length * sepalLength) +
                              (sepal_width * sepalWidth) +
                              (petal_length * petalLength) +
                              (petal_width * petalWidth) +
                              intercept;
    });

    return Object.keys(scores).reduce((bestSpecies, species) => scores[species] > scores[bestSpecies] ? species : bestSpecies);
};

document.querySelector('#flowerForm').addEventListener('submit', evt => {
    evt.preventDefault();

    // Retrieve values and validate
    const formElements = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'];
    const [sepalLength, sepalWidth, petalLength, petalWidth] = formElements.map(id => document.querySelector(`#${id}`).value);

    console.log("Sepal Length: ", sepalLength);
    console.log("Sepal Width: ", sepalWidth);
    console.log("Petal Length: ", petalLength);
    console.log("Petal Width: ", petalWidth);

    if (!validateFlower(sepalLength, sepalWidth, petalLength, petalWidth)) {
        console.log('OH NO! Error in Input!');
        formElements.forEach(id => document.querySelector(`#${id}`).value = '');

        document.querySelector('#prediction').textContent = 'Error! Please Enter valid flower dimensions!!';
        return;
    }

    // Calculate and display prediction
    const predictedSpecies = calculateFlowerClass(sepalLength, sepalWidth, petalLength, petalWidth);
    document.querySelector('#prediction').textContent = predictedSpecies;
});

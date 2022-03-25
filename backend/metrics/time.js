module.exports = {
    augment: function(dataset_el) {
        const time = dataset_el.time;
        const start_of_day = Date.parse(dataset_el.timestring.substring(0, 10) + ' 00:00:00');
        dataset_el.metrics.push((time - start_of_day) / 86400000);
    },
    augment_dataset: function(dataset) {
        dataset.forEach(module.exports.augment);
    }
}
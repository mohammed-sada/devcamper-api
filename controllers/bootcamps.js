function httpGetBootcamps(req, res) {
    res.status(200).json({ success: true, msg: `show all bootcamps` });
}

function httpGetBootcamp(req, res) {
    res.status(200).json({ success: true, msg: `show bootcamp ${req.params.id}` })
}

function httpCreateBootcamp(req, res) {
    res.status(201).json({ success: true, msg: `create bootcamp` })
}

function httpUpdateBootcamp(req, res) {
    res.status(200).json({ success: true, msg: `update bootcamp ${req.params.id}` })
}

function httpDeleteBootcamp(req, res) {
    res.status(200).json({ success: true, msg: `delete bootcamp ${req.params.id}` })
}

module.exports = {
    httpGetBootcamps,
    httpGetBootcamp,
    httpCreateBootcamp,
    httpUpdateBootcamp,
    httpDeleteBootcamp
}
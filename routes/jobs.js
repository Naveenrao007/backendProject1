const express = require("express");
const router = express.Router();
const { Job } = require("../schema/job.schema.js");
const authMiddleware = require("../middleware/auth.js");
const isAuth = require("../utils/index.js");
// create a post
router.post("/create", authMiddleware, async (req, res) => {
    // console.log(req.body)
    try {
        const {
            name,
            logo,
            position,
            salary,
            jobType,
            remote,
            location,
            description,
            about,
            skills,
            information,
        } = req.body;
        // const { user } = req;
        const jobs = skills.split(",").map(skill => skill.trim());
        const job = new Job({
            name,
            logo,
            position,
            salary,
            jobType,
            remote,
            location,
            description,
            about,
            skills: jobs,
            information,
            creator: user,
        });
        console.log({ job });
        await job.save();
        res.status(201).json({ message: "job created successfully", job: job });
    } catch (error) {
        res.status(400).json({ message: "Job not created" });
    }
});

router.get("/all", async (req, res) => {
    const isAuthenticated = isAuth(req)
    const alljobs = isAuthenticated ? await Job.find() : await Job.find().select("-creator -_id -__v")


    if (!alljobs) {
        res.status(400).json({ message: "jobs not found" })
    }
    res.status(200).json({ jobs: alljobs })
})

router.delete("/delete/:id", authMiddleware, async (req, res) => {
    const { id } = req.params
    const job = await Job.findById(id)
    console.log(job)
    if (!job) {
        res.status(400).json({ message: "No job found ! " })
    }
    if (job.creator.toString() !== req.user.toString()) {
        res.status(400).json({ message: "you are not authorize to delete this Job " })
    }
    await Job.findByIdAndDelete(id)
    res.status(200).json({ message: "job deleted successfully" })
})

router.get("/job/:id", authMiddleware, async (req, res) => {
    const { id } = req.params
    const job = await Job.findById(id)
    if (!job) { res.status(400).json({ message: "job not found" }) }
    res.status(200).json({ job: job })
})
router.put("/update/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params

        const { name, logo, position, salary, jobType, remote, location, description, about, skills, information, } = req.body;
        console.log("reqbody", req.body)

        let job = await Job.findById(id)
        console.log("foundJob", job)
        if (!job) {
            return res.status(400).json({ message: "job not found" })
        }
        if (job.creator.toString() !== req.user.toString()) {
            return res.status(400).json({ message: "you are not authorize to delete this Job " })
        }
        const jobSkill = skills.split(",").map(skill => skill.trim());
        job = await Job.findByIdAndUpdate(id, {
            name,
            logo,
            position,
            salary,
            jobType,
            remote,
            location,
            description,
            about,
            skills: jobSkill,
            information,
        }, { new: true })
        res.status(200).json(job)
    } catch (error) {

    }

})
router.get("/search/:title", async (req, res) => {
    const {title} = req.params;
    console.log("title", title)
    const jobs = await Job.find({ name: new RegExp(title, "i")}).select("-creator -_id -__v")
    console.log(jobs)
    if (!jobs) { return res.status(400).json({ message: "jobs not found" }) }
    res.status(200).json({ jobs: jobs })
})
module.exports = router;

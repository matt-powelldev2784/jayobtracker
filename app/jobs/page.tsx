import React from 'react'
import { getJobs } from './getJobs'

const Jobs = async () => {
  const jobs = await getJobs({})
  console.log('jobs', jobs)
  return <div>jobs</div>
}

export default Jobs

"""
Performance testing script for the Todo Backend API.

This script performs load testing on the Todo API endpoints to evaluate
performance under various loads and identify potential bottlenecks.
"""

import asyncio
import time
import aiohttp
import json
from collections import defaultdict
from typing import Dict, List, Tuple


class PerformanceTester:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.results = defaultdict(list)
        
    async def make_request(self, session: aiohttp.ClientSession, method: str, endpoint: str, payload=None):
        """Make a single API request and record timing."""
        start_time = time.time()
        status_code = 0
        
        try:
            if method.upper() == "GET":
                async with session.get(f"{self.base_url}{endpoint}") as response:
                    await response.text()  # Consume response
                    status_code = response.status
            elif method.upper() == "POST":
                async with session.post(f"{self.base_url}{endpoint}", json=payload) as response:
                    await response.text()  # Consume response
                    status_code = response.status
            elif method.upper() == "PUT":
                async with session.put(f"{self.base_url}{endpoint}", json=payload) as response:
                    await response.text()  # Consume response
                    status_code = response.status
            elif method.upper() == "DELETE":
                async with session.delete(f"{self.base_url}{endpoint}") as response:
                    await response.text()  # Consume response
                    status_code = response.status
        except Exception as e:
            print(f"Error making request to {endpoint}: {str(e)}")
            status_code = 500  # Mark as error
            
        end_time = time.time()
        response_time = (end_time - start_time) * 1000  # Convert to milliseconds
        
        return {
            "method": method,
            "endpoint": endpoint,
            "status_code": status_code,
            "response_time": response_time,
            "timestamp": start_time
        }
    
    async def run_concurrent_requests(self, requests: List[Tuple[str, str, dict]], num_concurrent: int = 10):
        """Run multiple requests concurrently."""
        async with aiohttp.ClientSession() as session:
            semaphore = asyncio.Semaphore(num_concurrent)
            
            async def limited_request(method, endpoint, payload):
                async with semaphore:
                    return await self.make_request(session, method, endpoint, payload)
                    
            tasks = [
                limited_request(method, endpoint, payload) 
                for method, endpoint, payload in requests
            ]
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            return results
    
    async def test_get_todos(self, num_requests: int = 100, concurrent_users: int = 10):
        """Test the GET /api/v1/todos endpoint."""
        print(f"Testing GET /api/v1/todos with {num_requests} requests, {concurrent_users} concurrent users...")
        
        requests = [("GET", "/api/v1/todos", None) for _ in range(num_requests)]
        results = await self.run_concurrent_requests(requests, concurrent_users)
        
        # Process results
        response_times = []
        errors = 0
        
        for result in results:
            if isinstance(result, Exception):
                errors += 1
                continue
                
            response_times.append(result["response_time"])
            if result["status_code"] != 200:
                errors += 1
                
        avg_response_time = sum(response_times) / len(response_times) if response_times else 0
        p95_response_time = sorted(response_times)[int(len(response_times) * 0.95)] if response_times else 0
        
        print(f"GET /api/v1/todos - Avg: {avg_response_time:.2f}ms, P95: {p95_response_time:.2f}ms, Errors: {errors}/{num_requests}")
        
        return {
            "avg_response_time": avg_response_time,
            "p95_response_time": p95_response_time,
            "total_requests": num_requests,
            "errors": errors,
            "success_rate": ((num_requests - errors) / num_requests) * 100 if num_requests > 0 else 0
        }
    
    async def test_create_todo(self, num_requests: int = 50, concurrent_users: int = 5):
        """Test the POST /api/v1/todos endpoint."""
        print(f"Testing POST /api/v1/todos with {num_requests} requests, {concurrent_users} concurrent users...")
        
        # Prepare payloads
        payloads = []
        for i in range(num_requests):
            payloads.append(("POST", "/api/v1/todos", {
                "title": f"Performance Test Todo {i}",
                "description": f"This is a performance test todo item #{i}",
                "is_completed": False
            }))
        
        results = await self.run_concurrent_requests(payloads, concurrent_users)
        
        # Process results
        response_times = []
        errors = 0
        
        for result in results:
            if isinstance(result, Exception):
                errors += 1
                continue
                
            response_times.append(result["response_time"])
            if result["status_code"] != 200:
                errors += 1
                
        avg_response_time = sum(response_times) / len(response_times) if response_times else 0
        p95_response_time = sorted(response_times)[int(len(response_times) * 0.95)] if response_times else 0
        
        print(f"POST /api/v1/todos - Avg: {avg_response_time:.2f}ms, P95: {p95_response_time:.2f}ms, Errors: {errors}/{num_requests}")
        
        return {
            "avg_response_time": avg_response_time,
            "p95_response_time": p95_response_time,
            "total_requests": num_requests,
            "errors": errors,
            "success_rate": ((num_requests - errors) / num_requests) * 100 if num_requests > 0 else 0
        }
    
    async def run_full_performance_test(self):
        """Run the complete performance test suite."""
        print("Starting performance tests for Todo Backend API...")
        print("=" * 60)
        
        # Test GET endpoint
        get_results = await self.test_get_todos(num_requests=100, concurrent_users=10)
        
        # Test POST endpoint
        post_results = await self.test_create_todo(num_requests=50, concurrent_users=5)
        
        print("=" * 60)
        print("Performance Test Summary:")
        print(f"GET /api/v1/todos - Success Rate: {get_results['success_rate']:.2f}%, Avg Response: {get_results['avg_response_time']:.2f}ms")
        print(f"POST /api/v1/todos - Success Rate: {post_results['success_rate']:.2f}%, Avg Response: {post_results['avg_response_time']:.2f}ms")
        
        # Overall assessment
        overall_success = min(get_results['success_rate'], post_results['success_rate'])
        avg_response = (get_results['avg_response_time'] + post_results['avg_response_time']) / 2
        
        print(f"\nOverall Performance Assessment:")
        print(f"- Success Rate: {overall_success:.2f}% ({'PASS' if overall_success >= 95 else 'FAIL'})")
        print(f"- Avg Response Time: {avg_response:.2f}ms ({'PASS' if avg_response < 200 else 'FAIL'})")
        
        return {
            "get_results": get_results,
            "post_results": post_results,
            "overall_success_rate": overall_success,
            "overall_avg_response_time": avg_response
        }


# Optimization recommendations based on performance results
def generate_optimization_report(results: Dict):
    """Generate optimization recommendations based on performance test results."""
    print("\nOptimization Recommendations:")
    print("-" * 40)
    
    # Check response times
    if results["overall_avg_response_time"] > 200:
        print("⚠️  Average response time exceeds 200ms threshold.")
        print("   Recommendations:")
        print("   - Implement database query optimization")
        print("   - Add caching for frequently accessed data")
        print("   - Consider database indexing improvements")
    
    # Check success rates
    if results["overall_success_rate"] < 95:
        print("⚠️  Success rate is below 95%.")
        print("   Recommendations:")
        print("   - Investigate error logs for failure patterns")
        print("   - Increase server resources if needed")
        print("   - Optimize database connection pooling")
    
    # Check P95 response times
    if results["get_results"]["p95_response_time"] > 500 or results["post_results"]["p95_response_time"] > 500:
        print("⚠️  P95 response times are high (>500ms).")
        print("   Recommendations:")
        print("   - Implement pagination for large datasets")
        print("   - Add database indexes for filtered fields")
        print("   - Consider implementing a CDN for static assets")
    
    if (results["overall_success_rate"] >= 95 and results["overall_avg_response_time"] < 200):
        print("✅ Performance targets met! All tests passed.")


async def main():
    """Main function to run performance tests."""
    tester = PerformanceTester(base_url="http://localhost:8000")  # Adjust URL as needed
    results = await tester.run_full_performance_test()
    generate_optimization_report(results)


if __name__ == "__main__":
    asyncio.run(main())
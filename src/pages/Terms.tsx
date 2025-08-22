import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default function Terms() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-luxury to-luxury-light bg-clip-text text-transparent">
              Terms of Service
            </h1>
            
            <p className="text-muted-foreground mb-6">
              <strong>Effective Date:</strong> {currentDate}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing and using the Roar Realty website and services, you accept and agree 
                to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Use License</h2>
              <p className="text-muted-foreground mb-4">
                Permission is granted to temporarily access the materials on Roar Realty's website 
                for personal, non-commercial transitory viewing only.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>This is the grant of a license, not a transfer of title</li>
                <li>This license shall automatically terminate if you violate any of these restrictions</li>
                <li>Upon terminating your viewing of these materials, you must destroy any downloaded materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Disclaimer</h2>
              <p className="text-muted-foreground mb-4">
                The materials on Roar Realty's website are provided on an 'as is' basis. 
                Roar Realty makes no warranties, expressed or implied, and hereby disclaims 
                and negates all other warranties including without limitation, implied warranties 
                or conditions of merchantability, fitness for a particular purpose, or 
                non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Limitations</h2>
              <p className="text-muted-foreground mb-4">
                In no event shall Roar Realty or its suppliers be liable for any damages 
                (including, without limitation, damages for loss of data or profit, or due to 
                business interruption) arising out of the use or inability to use the materials 
                on Roar Realty's website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Privacy Policy</h2>
              <p className="text-muted-foreground mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also 
                governs your use of the website, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Governing Law</h2>
              <p className="text-muted-foreground mb-4">
                These terms and conditions are governed by and construed in accordance with 
                the laws of the United Arab Emirates and you irrevocably submit to the 
                exclusive jurisdiction of the courts in that state or location.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at 
                <a href="mailto:legal@roarrealty.ae" className="text-luxury hover:underline ml-1">
                  legal@roarrealty.ae
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
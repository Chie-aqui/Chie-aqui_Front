import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def responder_reclamacao_empresa():
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
    wait = WebDriverWait(driver, 10)

    try:
        # 1. Acessar login
        driver.get("http://localhost:3000/login")
        time.sleep(1)

        # 2. Clicar na aba "Empresa"
        empresa_tab = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Empresa')]"))
        )
        empresa_tab.click()
        time.sleep(1)

        # 3. Preencher email
        wait.until(EC.visibility_of_element_located((By.ID, "company-email"))).send_keys("empresa@teste.com")
        time.sleep(1)

        # 4. Preencher senha
        driver.find_element(By.ID, "company-password").send_keys("teste123")
        time.sleep(1)

        # 5. Clicar em Entrar
        wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Entrar')]"))
        ).click()
        time.sleep(3)

        # 6. Clicar em Responder
        responder_btn = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Responder')]"))
        )
        responder_btn.click()
        time.sleep(1)

        # 7. Escrever resposta genérica
        resposta_texto = "Olá! Estamos analisando sua reclamação e retornaremos em breve com uma solução."
        wait.until(EC.visibility_of_element_located((By.ID, "response"))).send_keys(resposta_texto)
        time.sleep(1)

        # 8. Clicar em Enviar Resposta
        wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Enviar Resposta')]"))
        ).click()
        time.sleep(5)

    finally:
        time.sleep(100)

if __name__ == "__main__":
    responder_reclamacao_empresa()
